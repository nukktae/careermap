"use client";

import { useState } from "react";
import Link from "next/link";
import { PrepareToolCard } from "@/components/prepare/prepare-tool-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/app-icon";

const tools = [
  {
    href: "/prepare/skills",
    icon: "chart" as const,
    title: "스킬 갭 분석",
    description: "부족한 스킬을 파악하고 영향도·학습 시간으로 우선순위를 정하세요.",
    premium: false,
    locked: false,
  },
  {
    href: "/prepare/resume",
    icon: "document-text" as const,
    title: "이력서 최적화",
    description: "지원 직무에 맞게 문장을 다듬고 키워드와 성과를 강조하세요.",
    premium: false,
    locked: false,
  },
  {
    href: "/prepare/preview",
    icon: "document-download" as const,
    title: "이력서 미리보기",
    description: "원본과 최적화 버전을 비교하고 PDF로 내려받으세요.",
    premium: false,
    locked: false,
  },
  {
    href: "/prepare/cover-letter",
    icon: "message-text" as const,
    title: "자소서 가이드",
    description: "회사·질문별 구조, 강조할 경험, 샘플 문장 가이드를 받으세요.",
    premium: true,
    locked: true,
  },
  {
    href: "/prepare/interview",
    icon: "message-question" as const,
    title: "프리미엄 면접 준비",
    description: "질문 유형, 스토리 매핑, 회사 문화, 한국형 면접 포맷을 확인하세요.",
    premium: true,
    locked: true,
  },
];

export default function PreparePage() {
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">준비</h1>
        <p className="text-foreground-secondary">
          스킬 갭, 이력서·자소서·면접까지 한곳에서 준비하세요.
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
            locked={tool.locked}
            onLockedClick={() => setSubscriptionModalOpen(true)}
          />
        ))}
      </div>

      <Dialog open={subscriptionModalOpen} onOpenChange={setSubscriptionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary-500 mb-2">
              <AppIcon name="crown" className="w-6 h-6" />
              <DialogTitle className="text-xl">프리미엄 기능</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              이 기능은 구독 회원만 이용할 수 있어요. 구독하면 자소서 가이드,
              면접 준비를 무제한으로 사용할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setSubscriptionModalOpen(false)}
            >
              닫기
            </Button>
            <Button asChild>
              <Link href="/settings/billing" onClick={() => setSubscriptionModalOpen(false)}>
                구독하기
                <AppIcon name="arrow-right" className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
