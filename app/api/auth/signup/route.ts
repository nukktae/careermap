import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

const ONEWAVE_API_URL = process.env.ONEWAVE_API_URL?.replace(/\/$/, "");

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : undefined;
  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  if (ONEWAVE_API_URL) {
    let res: Response;
    try {
      res = await fetch(`${ONEWAVE_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
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
        { error: "Signup failed", details },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }
    return NextResponse.json(data);
  }

  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: name ? { name } : undefined,
    },
  });
  if (authError) {
    const details =
      /User already registered|already been registered/i.test(authError.message)
        ? "이미 가입된 이메일입니다. 로그인해 주세요."
        : authError.message;
    return NextResponse.json(
      { error: "Signup failed", details },
      { status: 400 }
    );
  }
  const session = authData.session;
  if (session) {
    return NextResponse.json({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }
  return NextResponse.json({
    message: "Signup successful. Check your email to confirm.",
    user: authData.user ? { id: authData.user.id, email: authData.user.email } : undefined,
  });
}
