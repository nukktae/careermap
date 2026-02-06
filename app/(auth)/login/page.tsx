"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const raw = data?.details ?? data?.error ?? "로그인에 실패했습니다.";
        const msg = typeof raw === "string" ? raw : "이메일 또는 비밀번호가 올바르지 않습니다.";
        const friendly =
          /rate limit|too many requests/i.test(msg)
            ? "요청이 너무 많습니다. 몇 분 후에 다시 시도해 주세요."
            : msg;
        setError(friendly);
        setIsLoading(false);
        return;
      }
      const access_token = data?.access_token;
      const refresh_token = data?.refresh_token;
      if (access_token && refresh_token) {
        const supabase = createClient();
        await supabase.auth.setSession({ access_token, refresh_token });
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Image
              src="/assets/logos/logojobja.jpg"
              alt="잡자"
              width={40}
              height={40}
              className="w-10 h-10 rounded-xl object-contain"
            />
            <span className="text-2xl font-bold text-foreground">잡자</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              다시 오셨네요!
            </h1>
            <p className="text-foreground-secondary">
              계정에 로그인하고 취업 준비를 계속하세요.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 text-sm">
              {error}
            </div>
          )}
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-500 hover:text-primary-600"
                >
                  비밀번호 찾기
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호 입력"
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                로그인 상태 유지
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  로그인 중...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  로그인
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-foreground-muted">
                또는
              </span>
            </div>
          </div>

          {/* Social login */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full h-12" type="button">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 계속하기
            </Button>
          </div>

          {/* Sign up link */}
          <p className="text-center mt-8 text-foreground-secondary">
            아직 계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              무료로 가입하기
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
        <div className="max-w-lg text-center text-white">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 overflow-hidden">
            <Image
              src="/assets/logos/logojobja.jpg"
              alt="잡자"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            취업 준비, 이제 명확하게
          </h2>
          <p className="text-lg text-white/80 mb-8">
            AI가 분석하는 내 경쟁력과 맞춤 준비 전략으로
            <br />
            취업 준비의 불확실성을 해소하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
