"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    nameKr: "무료",
    price: "0",
    period: "",
    description: "취업 준비를 시작하는 분들을 위한 기본 플랜",
    features: [
      { text: "월 20개 채용 매칭", included: true },
      { text: "기본 스킬 갭 분석", included: true },
      { text: "월 1회 이력서 최적화", included: true },
      { text: "기본 지원 현황 추적", included: true },
      { text: "자소서 가이드", included: false },
      { text: "면접 준비 가이드", included: false },
      { text: "AI 인사이트", included: false },
    ],
    cta: "무료로 시작하기",
    href: "/signup",
    popular: false,
  },
  {
    name: "Premium",
    nameKr: "프리미엄",
    price: "14,900",
    period: "/월",
    description: "본격적인 취업 준비를 위한 모든 기능 포함",
    features: [
      { text: "무제한 채용 매칭", included: true },
      { text: "상세 스킬 갭 분석", included: true },
      { text: "무제한 이력서 최적화", included: true },
      { text: "고급 지원 현황 추적", included: true },
      { text: "자소서 가이드", included: true },
      { text: "면접 준비 가이드", included: true },
      { text: "AI 인사이트", included: true },
    ],
    cta: "프리미엄 시작하기",
    href: "/signup?plan=premium",
    popular: true,
  },
  {
    name: "Annual",
    nameKr: "연간",
    price: "149,000",
    period: "/년",
    description: "연간 결제 시 2개월 무료 (17% 할인)",
    features: [
      { text: "프리미엄 모든 기능", included: true },
      { text: "연 2개월 무료", included: true },
      { text: "우선 고객 지원", included: true },
      { text: "신규 기능 조기 접근", included: true },
      { text: "1:1 커리어 상담 1회", included: true },
      { text: "이력서 전문가 피드백", included: true },
      { text: "모의 면접 1회", included: true },
      { text: "취업 성공 시 환불 보장", included: true },
    ],
    cta: "연간 플랜 시작하기",
    href: "/signup?plan=annual",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-background">
      <div className="container-app">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-badge text-primary-badge-text text-sm font-medium mb-4">
            요금제
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            투자한 만큼 돌아오는 가치
          </h2>
          <p className="text-lg text-foreground-secondary">
            취업 성공으로 얻는 연봉 상승을 생각하면, 가장 현명한 투자입니다.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl border ${
                plan.popular
                  ? "border-primary-500 shadow-lg shadow-primary-500/10"
                  : "border-border"
              } overflow-hidden`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  인기
                </div>
              )}

              <div className="p-6 lg:p-8">
                {/* Plan name */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {plan.nameKr}
                  </h3>
                  <p className="text-sm text-foreground-secondary">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    ₩{plan.price}
                  </span>
                  <span className="text-foreground-secondary">{plan.period}</span>
                </div>

                {/* CTA */}
                <Button
                  asChild
                  className={`w-full mb-6 ${
                    plan.popular ? "" : "bg-foreground hover:bg-foreground-hover"
                  }`}
                  variant={plan.popular ? "default" : "secondary"}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-foreground-muted flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-foreground"
                            : "text-foreground-muted"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        <div className="text-center mt-12">
          <p className="text-sm text-foreground-secondary">
            7일 무료 체험 후 결제 시작 · 언제든 취소 가능 · 취업 성공 시 환불 보장
          </p>
        </div>
      </div>
    </section>
  );
}
