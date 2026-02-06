import { NextRequest, NextResponse } from "next/server";

const ONEWAVE_API_URL = process.env.ONEWAVE_API_URL?.replace(/\/$/, "");

export async function POST(request: NextRequest) {
  if (!ONEWAVE_API_URL) {
    return NextResponse.json(
      { error: "ONEWAVE_API_URL not configured" },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing or invalid file (expected 'file' field)" },
      { status: 400 }
    );
  }

  const blob = new Blob([await file.arrayBuffer()], { type: file.type });
  const body = new FormData();
  body.set("file", blob, file.name);

  let res: Response;
  try {
    res = await fetch(`${ONEWAVE_API_URL}/analyze_file`, {
      method: "POST",
      body,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to call resume analysis service" },
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
      { error: "Resume analysis failed", details: detail },
      { status: res.status >= 500 ? 502 : res.status }
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from resume analysis" },
      { status: 502 }
    );
  }

  return NextResponse.json(json);
}
