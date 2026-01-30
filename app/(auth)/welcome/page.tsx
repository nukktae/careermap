"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, Target, TrendingUp, ArrowRight, Sparkles } from "lucide-react";

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
    description: "맞춤형 학습 플랜으로 경쟁력을 높이세요.",
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
              <Sparkles className="w-4 h-4" />
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
              <br />
              아래 3단계로 빠르게 시작할 수 있어요.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-10">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-background-secondary border border-border"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
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
