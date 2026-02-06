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
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const passwordRequirements = [
    { text: "최소 8자 이상", met: password.length >= 8 },
    { text: "영문 포함", met: /[a-zA-Z]/.test(password) },
    { text: "숫자 포함", met: /\d/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const passwordValue = (form.elements.namedItem("password") as HTMLInputElement).value;
    if (!email || !passwordValue) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: passwordValue, name: name || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const raw = data?.details ?? data?.error ?? "가입에 실패했습니다.";
        const msg = typeof raw === "string" ? raw : "가입에 실패했습니다.";
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
      router.push("/welcome");
      router.refresh();
    } catch {
      setError("가입 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 overflow-hidden">
            <Image
              src="/assets/logos/logojobja.jpg"
              alt="잡자"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            취업 준비의 새로운 시작
          </h2>
          <p className="text-lg text-white/80 mb-8">
            3분만 투자하면 내 경쟁력을 분석하고,
            <br />
            맞춤형 준비 전략을 받을 수 있어요.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              "AI가 분석하는 스킬 갭",
              "이력서 최적화 & 자소서",
              "지원 현황 추적 & 인사이트",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
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
              무료로 시작하기
            </h1>
            <p className="text-foreground-secondary">
              계정을 만들고 취업 준비를 시작하세요.
            </p>
          </div>

          {/* Social signup */}
          <div className="space-y-3 mb-6">
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
              Google로 시작하기
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-foreground-muted">
                또는 이메일로 가입
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 text-sm">
              {error}
            </div>
          )}
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="홍길동"
                  className="pl-10 h-12"
                />
              </div>
            </div>

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
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호 입력"
                  className="pl-10 pr-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {/* Password requirements */}
              <div className="flex flex-wrap gap-2 pt-1">
                {passwordRequirements.map((req, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${
                      req.met
                        ? "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400"
                        : "bg-background-secondary text-foreground-muted"
                    }`}
                  >
                    {req.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Checkbox id="terms" className="mt-0.5" required />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                <Link href="/terms" className="text-primary-500 hover:underline">
                  이용약관
                </Link>
                {" "}및{" "}
                <Link href="/privacy" className="text-primary-500 hover:underline">
                  개인정보처리방침
                </Link>
                에 동의합니다.
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
                  계정 생성 중...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  계정 만들기
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center mt-8 text-foreground-secondary">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
