import { NextRequest, NextResponse } from "next/server";

const ONEWAVE_API_URL = process.env.ONEWAVE_API_URL?.replace(/\/$/, "");

export async function POST(request: NextRequest) {
  if (!ONEWAVE_API_URL) {
    return NextResponse.json(
      { error: "ONEWAVE_API_URL not configured" },
      { status: 503 }
    );
  }

  let body: { company_name?: string; position?: string; tech_stack?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const company_name =
    typeof body.company_name === "string" ? body.company_name.trim() : "";
  const position =
    typeof body.position === "string" ? body.position.trim() : "";
  const tech_stack = Array.isArray(body.tech_stack)
    ? body.tech_stack.filter((t): t is string => typeof t === "string")
    : [];

  if (!company_name || !position) {
    return NextResponse.json(
      { error: "company_name and position are required" },
      { status: 400 }
    );
  }

  const payload = { company_name, position, tech_stack };

  let res: Response;
  try {
    res = await fetch(`${ONEWAVE_API_URL}/coffee-chat/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to call coffee-chat service" },
      { status: 502 }
    );
  }

  const text = await res.text();
  if (!res.ok) {
    let detail: unknown = text;
    try {
      detail = JSON.parse(text);
    } catch {
      // use raw text
    }
    return NextResponse.json(
      { error: "Coffee-chat generation failed", details: detail },
      { status: res.status >= 500 ? 502 : res.status }
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from coffee-chat service" },
      { status: 502 }
    );
  }

  return NextResponse.json(json);
}
