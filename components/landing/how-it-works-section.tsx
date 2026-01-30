"use client";

import { Upload, Search, GraduationCap, Briefcase } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "이력서 업로드",
    description:
      "PDF 또는 DOCX 형식의 이력서를 업로드하세요. AI가 30초 안에 분석을 완료합니다.",
    highlight: "30초 소요",
  },
  {
    number: "02",
    icon: Search,
    title: "매칭 결과 확인",
    description:
      "내 프로필에 맞는 채용 공고를 확인하세요. 각 공고별 적합도 점수와 부족한 스킬을 한눈에 볼 수 있습니다.",
    highlight: "AI 매칭",
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "맞춤 준비 시작",
    description:
      "목표 회사를 선택하면 2-4주 학습 플랜과 이력서 최적화 가이드를 받을 수 있습니다.",
    highlight: "맞춤 플랜",
  },
  {
    number: "04",
    icon: Briefcase,
    title: "자신있게 지원",
    description:
      "준비가 완료되면 지원하고, 칸반 보드로 모든 지원 현황을 관리하세요. AI 인사이트로 더 나은 전략을 세울 수 있습니다.",
    highlight: "취업 성공",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-background">
      <div className="container-app">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 text-sm font-medium mb-4">
            이용 방법
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            10분 안에 취업 준비 로드맵 완성
          </h2>
          <p className="text-lg text-foreground-secondary">
            복잡한 설정 없이 바로 시작할 수 있습니다.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-success-200 to-warning-200 dark:from-primary-800 dark:via-success-800 dark:to-warning-800" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step card */}
                <div className="bg-card rounded-2xl p-6 border border-border h-full">
                  {/* Number badge */}
                  <div className="w-12 h-12 rounded-xl bg-primary-500 text-white flex items-center justify-center font-bold text-lg mb-5 relative z-10">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-background-secondary flex items-center justify-center mb-5">
                    <step.icon className="w-7 h-7 text-foreground-secondary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-foreground-secondary leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Highlight badge */}
                  <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
                    {step.highlight}
                  </span>
                </div>

                {/* Arrow - mobile/tablet */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4 lg:hidden">
                    <svg
                      className="w-6 h-6 text-foreground-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
