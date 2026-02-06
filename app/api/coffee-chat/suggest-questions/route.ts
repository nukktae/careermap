import { NextRequest, NextResponse } from "next/server";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-2.5-flash";

function extractJson(str: string): string {
  const s = str.trim();
  const codeBlock = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock?.[1]) return codeBlock[1].trim();
  const start = s.indexOf("[");
  const end = s.lastIndexOf("]");
  if (start !== -1 && end !== -1 && end > start) return s.slice(start, end + 1);
  return s;
}

/** Normalize one item from Gemini (array of strings or object with questions/suggestions) into string[]. */
function normalizeItem(item: unknown): string[] {
  if (Array.isArray(item)) {
    return item
      .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
      .map((q) => q.trim())
      .slice(0, 3);
  }
  if (item != null && typeof item === "object") {
    const obj = item as Record<string, unknown>;
    const arr = (obj.questions ?? obj.suggestions ?? obj.q ?? Object.values(obj).flat()) as unknown[];
    if (Array.isArray(arr)) {
      return arr
        .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
        .map((q) => q.trim())
        .slice(0, 3);
    }
  }
  return [];
}

/** POST body: company_name, position, contacts: { name_and_title, snippet }[] */
export async function POST(request: NextRequest) {
  let body: {
    company_name?: string;
    position?: string;
    contacts?: Array<{ name_and_title?: string; snippet?: string }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const company_name = typeof body.company_name === "string" ? body.company_name.trim() : "";
  const position = typeof body.position === "string" ? body.position.trim() : "";
  const contacts = Array.isArray(body.contacts)
    ? body.contacts
        .filter((c) => c && (c.name_and_title != null || c.snippet != null))
        .map((c) => ({
          name_and_title: typeof c.name_and_title === "string" ? c.name_and_title : "",
          snippet: typeof c.snippet === "string" ? c.snippet : "",
        }))
    : [];

  if (!contacts.length) {
    return NextResponse.json({ suggestions: [] });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured" },
      { status: 503 }
    );
  }

  const contactList = contacts
    .map(
      (c, i) =>
        `[${i}] ${c.name_and_title || "이름 없음"}\n스니펫: ${(c.snippet || "").slice(0, 300)}`
    )
    .join("\n\n");

  const example =
    contacts.length >= 2
      ? `[["회사 문화는 어떤가요?","일일 업무는 어떻게 되나요?"],["이 직무에 필요한 역량은?","커리어 조언 부탁드려요."]]`
      : `[["업무 경험과 조언을 들을 수 있을까요?","팀 문화에 대해 여쭤봐도 될까요?"]]`;

  const prompt = `You are a career coach. Output ONLY a valid JSON array, nothing else.

Company: ${company_name}
Position: ${position}

For each of the ${contacts.length} contacts below, output an array of 2 or 3 short question strings in Korean (e.g. what to ask in a coffee chat). Be specific to each person's role.

Contacts:
${contactList}

Output a JSON array with exactly ${contacts.length} elements. Each element is an array of 2-3 Korean question strings.
Example format: ${example}

Output only the JSON array, no markdown or explanation.`;

  const geminiUrl = `${GEMINI_BASE}/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const geminiBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
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
    return NextResponse.json(
      { error: "Gemini API error", details: errText },
      { status: 502 }
    );
  }

  const geminiJson = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
    }>;
    error?: { message?: string };
  };
  const candidate = geminiJson?.candidates?.[0];
  const textPart = candidate?.content?.parts?.[0]?.text;
  if (!textPart || typeof textPart !== "string") {
    const reason = candidate?.finishReason ?? geminiJson?.error?.message;
    return NextResponse.json(
      { error: "Invalid response from Gemini", details: reason },
      { status: 502 }
    );
  }

  const raw = textPart.trim();
  let suggestions: string[][];
  try {
    const jsonStr = extractJson(raw);
    const parsed = JSON.parse(jsonStr) as unknown;
    if (!Array.isArray(parsed)) throw new Error("Expected array");
    suggestions = parsed.slice(0, contacts.length).map(normalizeItem);
  } catch {
    suggestions = contacts.map(() => []);
  }

  return NextResponse.json({ suggestions });
}
