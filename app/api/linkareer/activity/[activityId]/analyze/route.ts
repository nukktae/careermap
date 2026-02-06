import { NextRequest, NextResponse } from "next/server";

const LINKAREER_ORIGIN = "https://linkareer.com";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
/** Use a current model that supports image input + generateContent (gemini-1.5-flash is no longer available). */
const MODEL = "gemini-2.5-flash";

/** Extract detail body image URL (se2editor poster). */
function extractDetailImageUrl(html: string): string | null {
  const match = html.match(
    /https:\/\/media-cdn\.linkareer\.com\/+se2editor\/image\/\d+/
  );
  return match ? match[0] : null;
}

export interface AnalyzedSection {
  title: string;
  content: string;
}

/** In-memory cache by activityId to avoid repeated Gemini calls. */
const analysisCache = new Map<string, { sections: AnalyzedSection[] }>();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
) {
  const { activityId } = await params;
  if (!activityId) {
    return NextResponse.json(
      { error: "Missing activityId" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 503 }
    );
  }

  const cached = analysisCache.get(activityId);
  if (cached) {
    return NextResponse.json(cached);
  }

  const url = `${LINKAREER_ORIGIN}/activity/${activityId}`;
  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ko-KR,ko;q=0.9",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Linkareer returned ${res.status}` },
        { status: 502 }
      );
    }
    html = await res.text();
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Linkareer page" },
      { status: 502 }
    );
  }

  const detailImageUrl = extractDetailImageUrl(html);
  if (!detailImageUrl) {
    return NextResponse.json(
      { error: "No detail image found for this activity" },
      { status: 404 }
    );
  }

  let imageBase64: string;
  let mimeType = "image/png";
  try {
    const imgRes = await fetch(detailImageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });
    if (!imgRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch detail image" },
        { status: 502 }
      );
    }
    const contentType = imgRes.headers.get("content-type") || "";
    if (contentType.includes("jpeg") || contentType.includes("jpg")) {
      mimeType = "image/jpeg";
    } else if (contentType.includes("webp")) {
      mimeType = "image/webp";
    }
    const buf = await imgRes.arrayBuffer();
    imageBase64 = Buffer.from(buf).toString("base64");
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch or encode image" },
      { status: 502 }
    );
  }

  const prompt = `You are an OCR assistant. This image is a Korean job posting poster (채용 공고 이미지). 

1. OCR and read ALL text visible in the image.
2. Structure the extracted text into sections. Common section titles in Korean job postings: 회사 소개, 업무 내용, 자격 요건, 우대 사항, 복리후생, 지원 방법, 채용 절차, 기타. Use the exact headings you see in the image when possible; otherwise use these.
3. Return a JSON array only. Each element must have two keys: "title" (string, section heading) and "content" (string, full text of that section). Preserve line breaks in content. If there is only one block of text, use one object with title "상세 내용".

Output valid JSON only, no markdown, no code fence, no explanation. Example:
[{"title":"회사 소개","content":"..."},{"title":"업무 내용","content":"..."}]`;

  const geminiUrl = `${GEMINI_BASE}/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBase64,
            },
          },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
    },
  };

  let geminiRes: Response;
  try {
    geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to call Gemini API" },
      { status: 502 }
    );
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    return NextResponse.json(
      { error: "Gemini API error", details: errText },
      { status: 502 }
    );
  }

  const geminiJson = await geminiRes.json();
  const textPart = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textPart || typeof textPart !== "string") {
    return NextResponse.json(
      { error: "Invalid response from Gemini" },
      { status: 502 }
    );
  }

  function extractJson(str: string): string {
    const s = str.trim();
    const codeBlock = s.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock?.[1]) return codeBlock[1].trim();
    const start = s.indexOf("[");
    const end = s.lastIndexOf("]");
    if (start !== -1 && end !== -1 && end > start) return s.slice(start, end + 1);
    return s;
  }

  let sections: AnalyzedSection[];
  try {
    const jsonStr = extractJson(textPart);
    const parsed = JSON.parse(jsonStr) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error("Expected array");
    }
    sections = parsed.filter(
      (item): item is AnalyzedSection =>
        item != null &&
        typeof item === "object" &&
        typeof (item as AnalyzedSection).title === "string" &&
        typeof (item as AnalyzedSection).content === "string"
    );
    if (sections.length === 0) {
      sections = [{ title: "상세 내용", content: textPart }];
    }
  } catch {
    sections = [{ title: "상세 내용", content: textPart }];
  }

  const result = { sections };
  analysisCache.set(activityId, result);

  return NextResponse.json(result);
}
