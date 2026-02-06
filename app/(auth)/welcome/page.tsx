"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, Target, TrendingUp, ArrowRight } from "lucide-react";

function TickCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="currentColor" />
    </svg>
  );
}

const steps = [
  {
    icon: Upload,
    title: "이력서 업로드",
    description: "PDF 또는 DOCX 형식의 이력서를 업로드하세요.",
  },
  {
    icon: Target,
    title: "매칭 결과 확인",
    description: "AI가 분석한 채용별 적합도를 확인하세요.",
  },
  {
    icon: TrendingUp,
    title: "준비 시작",
    description: "스킬 갭과 이력서 최적화로 경쟁력을 높이세요.",
  },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-background dark:from-primary-950/20 dark:to-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Content Card */}
        <div className="bg-card rounded-3xl border border-border shadow-xl p-8 lg:p-12">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 text-sm font-medium">
              <TickCircleIcon className="w-4 h-4 shrink-0" />
              <span>가입 완료!</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              환영합니다!
            </h1>
            <p className="text-lg text-foreground-secondary text-pretty">
              이제 취업 준비를 시작해볼까요?
            </p>
          </div>

          {/* Steps - use design system tokens for cross-browser consistency */}
          <div className="space-y-4 mb-10">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-background-secondary"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary-badge">
                  <step.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary-500">
                      STEP {index + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-foreground-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Button asChild className="w-full h-14 text-lg">
              <Link href="/onboarding/resume">
                이력서 업로드하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>

            <Button variant="ghost" asChild className="w-full h-12">
              <Link href="/dashboard">나중에 하기</Link>
            </Button>
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-foreground-muted mt-8">
          질문이 있으신가요?{" "}
          <Link href="/help" className="text-primary-500 hover:underline">
            도움말 보기
          </Link>
        </p>
      </div>
    </div>
  );
}
