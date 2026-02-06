"use client";

const steps = [
  {
    id: "step-1",
    number: "01",
    title: "이력서 업로드",
    description:
      "PDF 또는 DOCX 파일을 업로드하세요. AI가 30초 내에 당신의 경험을 분석합니다.",
  },
  {
    id: "step-2",
    number: "02",
    title: "매칭 결과 확인",
    description:
      "추천 공고 리스트와 함께 직무별 적합도 점수, 부족한 스킬을 한눈에 확인하세요.",
  },
  {
    id: "step-3",
    number: "03",
    title: "맞춤 준비 시작",
    description:
      "목표 기업을 선택하면 AI가 최적화된 이력서 가이드와 면접 팁을 제공합니다.",
  },
  {
    id: "step-4",
    number: "04",
    title: "자신있게 지원",
    description:
      "칸반 보드로 지원 현황을 관리하고, AI 인사이트를 통해 다음 전략을 세우세요.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background-secondary">
      <div className="container-app">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-card text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full mb-4 shadow-sm border border-primary-100 dark:border-primary-900">
            WORKFLOW
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            이용 방법
          </h2>
          <p className="text-foreground-secondary">
            단 4단계로 완성하는 스마트한 취업 준비 여정
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line - desktop */}
          <div
            className="hidden lg:block absolute top-8 left-0 w-full h-0.5 bg-primary-100 dark:bg-primary-900 z-0"
            style={{ top: "7rem" }}
            aria-hidden
          />

          {steps.map((step, index) => (
            <div key={step.id} id={step.id} className="relative z-10">
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 text-xl font-bold shadow-xl ${
                    index === 0
                      ? "bg-primary-500 text-white shadow-primary-200 dark:shadow-primary-900/50"
                      : "bg-card text-primary-600 dark:text-primary-400 border-4 border-primary-100 dark:border-primary-800"
                  }`}
                >
                  {step.number}
                </div>
                <div className="bg-card p-8 rounded-3xl shadow-sm border border-border">
                  <h4 className="font-bold text-lg text-foreground mb-3">
                    {step.title}
                  </h4>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow - mobile/tablet */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4 lg:hidden" aria-hidden>
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
    </section>
  );
}
