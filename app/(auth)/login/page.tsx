"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, ArrowRight, UserCircle2 } from "lucide-react";

/** 운영진 전용: 클릭 시 해당 계정으로 바로 로그인됩니다. */
const STAFF_CREDENTIAL = {
  label: "운영진",
  email: "anu.bn@yahoo.com",
  password: "wasd123",
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirectTo = redirectParam ?? "/onboarding/resume";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        const msg = authError.message;
        const friendly =
          /Invalid login credentials|invalid_credentials/i.test(msg)
            ? "이메일 또는 비밀번호가 올바르지 않습니다."
            : /rate limit|too many requests/i.test(msg)
              ? "요청이 너무 많습니다. 몇 분 후에 다시 시도해 주세요."
              : msg;
        setError(friendly);
        setIsLoading(false);
        return;
      }
      if (authData?.session) {
        const path =
          redirectTo.startsWith("/") && !redirectTo.startsWith("//")
            ? redirectTo
            : "/onboarding/resume";
        router.push(path);
        router.refresh();
      } else {
        setError("로그인에 실패했습니다. 다시 시도해 주세요.");
        setIsLoading(false);
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  const handleStaffLogin = async (email: string, password: string) => {
    setError(null);
    if (emailInputRef.current) emailInputRef.current.value = email;
    if (passwordInputRef.current) passwordInputRef.current.value = password;
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(
          /Invalid login credentials|invalid_credentials/i.test(authError.message)
            ? "이메일 또는 비밀번호가 올바르지 않습니다."
            : authError.message
        );
        setIsLoading(false);
        return;
      }
      if (authData?.session) {
        const path =
          redirectTo.startsWith("/") && !redirectTo.startsWith("//")
            ? redirectTo
            : "/onboarding/resume";
        router.push(path);
        router.refresh();
      } else {
        setError("로그인에 실패했습니다. 다시 시도해 주세요.");
        setIsLoading(false);
      }
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
                  ref={emailInputRef}
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
                  ref={passwordInputRef}
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

          {/* 운영진 전용: 클릭 한 번으로 로그인 */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-3">
              운영진 전용
            </p>
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                handleStaffLogin(STAFF_CREDENTIAL.email, STAFF_CREDENTIAL.password)
              }
              className="flex items-center gap-3 w-full p-3 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary-200 dark:hover:border-primary-800 transition-colors text-left disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                <UserCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-medium text-foreground block truncate">
                  {STAFF_CREDENTIAL.label}
                </span>
                <span className="text-xs text-foreground-muted truncate block">
                  {STAFF_CREDENTIAL.email}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-foreground-muted shrink-0" />
            </button>
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

function LoginPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-foreground-muted">로딩 중...</div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
