import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

const ONEWAVE_API_URL = process.env.ONEWAVE_API_URL?.replace(/\/$/, "");

export async function POST(request: NextRequest) {
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

  if (ONEWAVE_API_URL) {
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

  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (authError) {
    const details =
      /Invalid login credentials|invalid_credentials/i.test(authError.message)
        ? "이메일 또는 비밀번호가 올바르지 않습니다."
        : authError.message;
    return NextResponse.json(
      { error: "Login failed", details },
      { status: 401 }
    );
  }
  const session = authData.session;
  if (!session) {
    return NextResponse.json(
      { error: "Login failed", details: "세션을 생성할 수 없습니다." },
      { status: 401 }
    );
  }
  return NextResponse.json({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });
}
