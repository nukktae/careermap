import { NextRequest, NextResponse } from "next/server";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-2.5-flash";

export interface AnalyzedSection {
  title: string;
  content: string;
}

/** Parse JSON array from model output. */
function extractJson(str: string): string {
  const s = str.trim();
  const codeBlock = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock?.[1]) return codeBlock[1].trim();
  const start = s.indexOf("[");
  const end = s.lastIndexOf("]");
  if (start !== -1 && end !== -1 && end > start) return s.slice(start, end + 1);
  return s;
}

export async function POST(request: NextRequest) {
  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "Missing or empty text" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured. Set GEMINI_API_KEY to a Gemini Developer API key (Google AI Studio)." },
      { status: 503 }
    );
  }

  const prompt = `You are an expert at structuring Korean job postings (채용 공고). Below is raw text from a job posting. Your task:

1. Split the text into logical sections (e.g. 선발예정인원, 지원자격, 접수방법, 채용절차, 근무조건, 복리후생, 유의사항, 공고일 등). Use the exact section titles that appear in the text when possible.
2. Make each section easy to scan: keep headings clear and content well-formatted (preserve line breaks and lists where helpful).
3. Return a JSON array only. Each element must have exactly two keys: "title" (string, section heading) and "content" (string, full text of that section). Preserve line breaks in content.
4. If the text is already one short block with no clear sections, return one object with title "상세 내용" and the full text as content.

Output valid JSON only: no markdown, no code fence, no explanation.
Example: [{"title":"선발예정인원","content":"..."},{"title":"지원자격","content":"..."}]

Raw job posting text:
---
${text.slice(0, 28000)}
---`;

  const geminiUrl = `${GEMINI_BASE}/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const geminiBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8192,
    },
  };

  let res: Response;
  try {
    res = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to call Gemini API" },
      { status: 502 }
    );
  }

  if (!res.ok) {
    const errText = await res.text();
    const isAuthError = res.status === 401 || /UNAUTHENTICATED|API keys are not supported|OAuth2/i.test(errText);
    const message = isAuthError
      ? "Gemini API key invalid or not set. Use a Gemini Developer API key from Google AI Studio (https://aistudio.google.com/apikey), not a Vertex key."
      : "Gemini API error";
    return NextResponse.json(
      { error: message, details: isAuthError ? errText : undefined },
      { status: isAuthError ? 503 : 502 }
    );
  }

  const geminiJson = await res.json();
  const textPart = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textPart || typeof textPart !== "string") {
    return NextResponse.json(
      { error: "Invalid response from Gemini" },
      { status: 502 }
    );
  }

  let sections: AnalyzedSection[];
  try {
    const jsonStr = extractJson(textPart);
    const parsed = JSON.parse(jsonStr) as unknown;
    if (!Array.isArray(parsed)) throw new Error("Expected array");
    sections = parsed.filter(
      (item): item is AnalyzedSection =>
        item != null &&
        typeof item === "object" &&
        typeof (item as AnalyzedSection).title === "string" &&
        typeof (item as AnalyzedSection).content === "string"
    );
    if (sections.length === 0) {
      sections = [{ title: "상세 내용", content: text }];
    }
  } catch {
    sections = [{ title: "상세 내용", content: text }];
  }

  return NextResponse.json({ sections });
}
