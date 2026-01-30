"use client";

import { PrepareToolCard } from "@/components/prepare/prepare-tool-card";

const tools = [
  {
    href: "/prepare/skills",
    icon: "chart" as const,
    title: "스킬 갭 분석",
    description: "부족한 스킬을 파악하고 영향도·학습 시간으로 우선순위를 정하세요.",
    premium: false,
  },
  {
    href: "/prepare/plan",
    icon: "task" as const,
    title: "학습 플랜",
    description: "채용별 2~4주 액션 플랜으로 스킬을 채우고 매칭을 올리세요.",
    premium: false,
  },
  {
    href: "/prepare/resume",
    icon: "document-text" as const,
    title: "이력서 최적화",
    description: "지원 직무에 맞게 문장을 다듬고 키워드와 성과를 강조하세요.",
    premium: false,
  },
  {
    href: "/prepare/preview",
    icon: "document-download" as const,
    title: "이력서 미리보기",
    description: "원본과 최적화 버전을 비교하고 PDF로 내려받으세요.",
    premium: false,
  },
  {
    href: "/prepare/cover-letter",
    icon: "message-text" as const,
    title: "자소서 가이드",
    description: "회사·질문별 구조, 강조할 경험, 샘플 문장 가이드를 받으세요.",
    premium: true,
  },
  {
    href: "/prepare/interview",
    icon: "message-question" as const,
    title: "면접 준비",
    description: "질문 유형, 스토리 매핑, 회사 문화, 한국형 면접 포맷을 확인하세요.",
    premium: true,
  },
];

export default function PreparePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">준비</h1>
        <p className="text-foreground-secondary">
          스킬 갭, 학습 플랜, 이력서·자소서·면접까지 한곳에서 준비하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <PrepareToolCard
            key={tool.href}
            href={tool.href}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            premium={tool.premium}
          />
        ))}
      </div>
    </div>
  );
}
