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

/** Extract plain text from HTML for text-only jobs (no poster image). */
function extractTextFromHtml(html: string, maxLength = 28000): string {
  const stripped = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.slice(0, maxLength);
}

export interface AnalyzedSection {
  title: string;
  content: string;
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

function parseSectionsFromGeminiText(textPart: string): AnalyzedSection[] {
  try {
    const jsonStr = extractJson(textPart);
    const parsed = JSON.parse(jsonStr) as unknown;
    if (!Array.isArray(parsed)) throw new Error("Expected array");
    const sections = parsed.filter(
      (item): item is AnalyzedSection =>
        item != null &&
        typeof item === "object" &&
        typeof (item as AnalyzedSection).title === "string" &&
        typeof (item as AnalyzedSection).content === "string"
    );
    if (sections.length === 0) return [{ title: "상세 내용", content: textPart }];
    return sections;
  } catch {
    return [{ title: "상세 내용", content: textPart }];
  }
}

/** Call Gemini text-only and return parsed sections. Same auth as image path. */
async function callGeminiTextOnly(
  prompt: string,
  apiKey: string
): Promise<AnalyzedSection[]> {
  const geminiUrl = `${GEMINI_BASE}/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
  };
  const res = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 401 || /UNAUTHENTICATED|API keys are not supported|OAuth2/i.test(errText)) {
      throw new Error(
        "Gemini API key invalid or not set. Use a Gemini Developer API key from Google AI Studio (https://aistudio.google.com/apikey), not a Vertex key."
      );
    }
    throw new Error(errText || "Gemini API error");
  }
  const geminiJson = await res.json();
  const textPart = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textPart || typeof textPart !== "string") {
    throw new Error("Invalid response from Gemini");
  }
  return parseSectionsFromGeminiText(textPart);
}

/** In-memory cache by activityId to avoid repeated Gemini calls. */
const analysisCache = new Map<string, { sections: AnalyzedSection[] }>();

const TEXT_ONLY_PROMPT = `You are an expert at structuring Korean job postings (채용 공고). Below is raw text from a job posting page.

1. Split the text into logical sections (e.g. 부서 소개, 직무, 자격 요건, 우대 사항, 복리후생, 지원 방법, 채용 절차). Use the exact section titles that appear in the text when possible.
2. Return a JSON array only. Each element must have exactly two keys: "title" (string) and "content" (string). Preserve line breaks in content.
3. If the text is one short block with no clear sections, return one object with title "상세 내용" and the full text as content.

Output valid JSON only: no markdown, no code fence, no explanation.
Example: [{"title":"부서 소개","content":"..."},{"title":"직무","content":"..."}]

Raw job posting text:
---
`;

const IMAGE_OCR_PROMPT = `You are an OCR assistant. This image is a Korean job posting poster (채용 공고 이미지). 

1. OCR and read ALL text visible in the image.
2. Structure the extracted text into sections. Common section titles in Korean job postings: 회사 소개, 업무 내용, 자격 요건, 우대 사항, 복리후생, 지원 방법, 채용 절차, 기타. Use the exact headings you see in the image when possible; otherwise use these.
3. Return a JSON array only. Each element must have two keys: "title" (string, section heading) and "content" (string, full text of that section). Preserve line breaks in content. If there is only one block of text, use one object with title "상세 내용".

Output valid JSON only, no markdown, no code fence, no explanation. Example:
[{"title":"회사 소개","content":"..."},{"title":"업무 내용","content":"..."}]`;

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
      { error: "Gemini API key not configured. Set GEMINI_API_KEY to a Gemini Developer API key (Google AI Studio)." },
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

  // Text-only path: no poster image — extract text from HTML and call Gemini with text only
  if (!detailImageUrl) {
    const rawText = extractTextFromHtml(html);
    if (!rawText || rawText.length < 50) {
      return NextResponse.json(
        { error: "No detail image or sufficient text found for this activity" },
        { status: 404 }
      );
    }
    try {
      const sections = await callGeminiTextOnly(
        TEXT_ONLY_PROMPT + rawText + "\n---",
        apiKey
      );
      const result = { sections };
      analysisCache.set(activityId, result);
      return NextResponse.json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const status = message.includes("API key") ? 503 : 502;
      return NextResponse.json(
        { error: "Gemini API error", details: message },
        { status }
      );
    }
  }

  // Image path: fetch poster image and call Gemini with image + OCR prompt
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

  const geminiUrl = `${GEMINI_BASE}/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [
      {
        parts: [
          { inline_data: { mime_type: mimeType, data: imageBase64 } },
          { text: IMAGE_OCR_PROMPT },
        ],
      },
    ],
    generationConfig: { temperature: 0.1 },
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
    if (geminiRes.status === 401 || /UNAUTHENTICATED|API keys are not supported|OAuth2/i.test(errText)) {
      return NextResponse.json(
        {
          error: "Gemini API key invalid or not set. Use a Gemini Developer API key from Google AI Studio (https://aistudio.google.com/apikey), not a Vertex key.",
          details: errText,
        },
        { status: 503 }
      );
    }
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

  const sections = parseSectionsFromGeminiText(textPart);
  const result = { sections };
  analysisCache.set(activityId, result);

  return NextResponse.json(result);
}
