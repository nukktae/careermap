import { NextRequest, NextResponse } from "next/server";

const ONEWAVE_API_URL = process.env.ONEWAVE_API_URL?.replace(/\/$/, "");

export async function POST(request: NextRequest) {
  if (!ONEWAVE_API_URL) {
    return NextResponse.json(
      { error: "ONEWAVE_API_URL not configured" },
      { status: 503 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  let res: Response;
  try {
    res = await fetch(`${ONEWAVE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach auth service" },
      { status: 502 }
    );
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json(
      { error: "Invalid response from auth service" },
      { status: 502 }
    );
  }

  if (!res.ok) {
    const raw =
      data && typeof data === "object" && "detail" in data
        ? (data as { detail: string }).detail
        : text;
    const details =
      typeof raw === "string" && /rate limit|too many requests/i.test(raw)
        ? "요청이 너무 많습니다. 몇 분 후에 다시 시도해 주세요."
        : raw;
    return NextResponse.json(
      { error: "Login failed", details },
      { status: res.status >= 500 ? 502 : res.status }
    );
  }

  return NextResponse.json(data);
}
