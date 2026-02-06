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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passwordRequirements = [
    { text: "최소 8자 이상", met: password.length >= 8 },
    { text: "영문 포함", met: /[a-zA-Z]/.test(password) },
    { text: "숫자 포함", met: /\d/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const passwordValue = (form.elements.namedItem("password") as HTMLInputElement).value;
    if (!email || !passwordValue) return;
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: passwordValue,
        options: {
          data: name ? { name } : undefined,
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
        },
      });
      if (authError) {
        const msg = authError.message;
        const friendly =
          /User already registered|already been registered/i.test(msg)
            ? "이미 가입된 이메일입니다. 로그인해 주세요."
            : /rate limit|too many requests/i.test(msg)
              ? "요청이 너무 많습니다. 몇 분 후에 다시 시도해 주세요."
              : msg;
        setError(friendly);
        setIsLoading(false);
        return;
      }
      if (authData?.session) {
        router.push("/welcome");
        router.refresh();
      } else if (authData?.user && !authData.session) {
        setSuccessMessage("가입 완료. 이메일 확인 링크를 보냈습니다. 메일함을 확인해 주세요.");
        setIsLoading(false);
      } else {
        setError("가입에 실패했습니다. 다시 시도해 주세요.");
        setIsLoading(false);
      }
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

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm">
              {successMessage}
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
