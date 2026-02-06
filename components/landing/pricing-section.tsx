"use client";

import Link from "next/link";
import { Check, Sparkles, Star } from "lucide-react";

const plans = [
  {
    id: "plan-free",
    name: "무료",
    subtitle: "취업 준비를 막 시작했다면",
    price: "0",
    period: "/ 월",
    features: [
      "월 20회 채용 공고 매칭",
      "기본 스킬 갭 분석",
      "월 1회 이력서 최적화",
      "기본 지원 현황 추적",
    ],
    cta: "시작하기",
    href: "/signup",
    popular: false,
    dark: false,
  },
  {
    id: "plan-premium",
    name: "프리미엄 (월간)",
    subtitle: "본격적으로 취업을 준비한다면",
    price: "14,900",
    period: "/ 월",
    features: [
      "무제한 채용 공고 매칭",
      "상세 스킬 갭 분석",
      "무제한 이력서 최적화",
      "고급 지원 현황 추적",
      "자소서 & 면접 가이드 전체 제공",
    ],
    cta: "구독하기",
    href: "/signup?plan=premium",
    popular: true,
    dark: false,
  },
  {
    id: "plan-annual",
    name: "연간 플랜",
    subtitle: "장기적인 커리어 성장을 위해",
    price: "149,000",
    period: "/ 년",
    badge: "2개월 무료 혜택",
    features: [
      "프리미엄 모든 기능 포함",
      "1:1 커리어 컨설팅 (연 1회)",
      "이력서 전문가 피드백",
      "AI 모의 면접 무제한",
      "취업 성공 환급 보장",
    ],
    cta: "지금 시작하기",
    href: "/signup?plan=annual",
    popular: false,
    dark: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container-app">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            합리적인 요금제
          </h2>
          <p className="text-foreground-secondary">
            당신의 준비 속도와 목표에 맞는 플랜을 선택하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              id={plan.id}
              className={`relative flex flex-col p-10 rounded-[40px] border ${
                plan.dark
                  ? "bg-gray-900 text-white border-gray-800 dark:bg-gray-950 dark:border-gray-800"
                  : plan.popular
                    ? "border-2 border-primary-500 bg-card shadow-2xl shadow-primary-100/50 dark:shadow-primary-900/20"
                    : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  가장 인기 있는
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.dark ? "text-white" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={
                    plan.dark
                      ? "text-gray-400 text-sm"
                      : "text-foreground-secondary text-sm"
                  }
                >
                  {plan.subtitle}
                </p>
              </div>

              <div className="mb-8">
                <span
                  className={`text-4xl font-bold ${
                    plan.dark ? "text-white" : "text-foreground"
                  }`}
                >
                  ₩{plan.price}
                </span>
                <span
                  className={
                    plan.dark
                      ? "text-gray-500 text-sm"
                      : "text-foreground-muted text-sm"
                  }
                >
                  {plan.period}
                </span>
                {plan.badge && (
                  <div className="mt-2 text-primary-400 text-xs font-bold">
                    {plan.badge}
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((item, i) => (
                  <li
                    key={item}
                    className={`flex items-center gap-3 text-sm ${
                      plan.dark
                        ? i === plan.features.length - 1
                          ? "text-primary-400 font-bold"
                          : "text-gray-300"
                        : "text-foreground-secondary"
                    }`}
                  >
                    {i === plan.features.length - 1 && plan.dark ? (
                      <Star className="w-5 h-5 text-primary-400 shrink-0" />
                    ) : (
                      <Check className="w-5 h-5 text-primary-500 shrink-0" />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-4 rounded-2xl font-bold text-center transition-colors block ${
                  plan.dark
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : plan.popular
                      ? "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-200 dark:shadow-primary-900/30"
                      : "border border-border text-foreground hover:bg-background-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
