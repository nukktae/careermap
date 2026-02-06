"use client";

import { Target, BarChart3, FileText, Brain, Users } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "AI 매칭 점수",
    description:
      "이력서를 분석해 각 채용에 대한 적합도를 85%~100% 정확도로 계산합니다. 어디에 지원할지 더 이상 고민하지 마세요.",
    color: "primary",
  },
  {
    icon: Brain,
    title: "스킬 갭 분석",
    description:
      "목표 회사에서 요구하는 기술과 내가 가진 기술의 차이를 명확하게 보여주고, 무엇을 준비해야 하는지 알려드립니다.",
    color: "success",
  },
  {
    icon: FileText,
    title: "이력서 최적화",
    description:
      "AI가 지원하는 회사에 맞게 이력서 문구를 다시 작성해 드립니다. 더 강력한 표현으로 경쟁력을 높이세요.",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "지원 현황 추적",
    description:
      "칸반 보드로 모든 지원 현황을 한눈에 관리하고, AI가 지원 패턴을 분석해 개선점을 알려드립니다.",
    color: "success",
  },
  {
    icon: Users,
    title: "자소서 & 면접 가이드",
    description:
      "회사별 자소서 작성 팁과 예상 면접 질문을 제공합니다. 한국 채용 문화에 최적화된 준비를 도와드립니다.",
    color: "warning",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary-badge",
    icon: "text-primary-600 dark:text-primary-400",
    border: "group-hover:border-primary-200 dark:group-hover:border-primary-800",
  },
  success: {
    bg: "bg-success-badge",
    icon: "text-success-600 dark:text-success-400",
    border: "group-hover:border-success-200 dark:group-hover:border-success-800",
  },
  warning: {
    bg: "bg-warning-badge",
    icon: "text-warning-600 dark:text-warning-400",
    border: "group-hover:border-warning-200 dark:group-hover:border-warning-800",
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-background-secondary">
      <div className="container-app">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-badge text-primary-badge-text text-sm font-medium mb-4">
            주요 기능
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            취업 준비의 모든 것을 한 곳에서
          </h2>
          <p className="text-lg text-foreground-secondary text-pretty">
            막연한 불안감 대신 명확한 데이터로 취업을 준비하세요.
            <br className="hidden sm:block" />
            AI가 분석하고, 당신은 실행에만 집중하세요.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <div
                key={feature.title}
                className={`group bg-card rounded-2xl p-6 lg:p-8 border border-border transition-all duration-300 card-interactive ${colors.border}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-5`}
                >
                  <feature.icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
