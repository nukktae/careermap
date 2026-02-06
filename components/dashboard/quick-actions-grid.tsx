"use client";

import Link from "next/link";
import { AppIcon } from "@/components/ui/app-icon";
import type { AppIconName } from "@/components/ui/app-icon";

export interface QuickActionItem {
  icon: AppIconName;
  label: string;
  description: string;
  href: string;
}

const defaultActions: QuickActionItem[] = [
  {
    icon: "document-text",
    label: "이력서 최적화",
    description: "AI 기반 맞춤 진단",
    href: "/prepare/resume",
  },
  {
    icon: "search",
    label: "채용 찾기",
    description: "실시간 공고 탐색",
    href: "/jobs",
  },
  {
    icon: "clipboard-text",
    label: "지원 추가",
    description: "직접 지원 기록하기",
    href: "/track",
  },
  {
    icon: "chart",
    label: "인사이트 보기",
    description: "취업 데이터 분석",
    href: "/track/insights",
  },
];

export function QuickActionsGrid({
  actions = defaultActions,
}: {
  actions?: QuickActionItem[];
}) {
  return (
    <section
      id="quick-actions"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      aria-label="빠른 액션"
    >
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="group flex items-center gap-4 p-5 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-primary-50 dark:bg-primary-950/50 rounded-xl text-primary-600 dark:text-primary-400 group-hover:bg-primary-500 group-hover:text-primary-foreground transition-colors shrink-0">
            <AppIcon name={action.icon} className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground">{action.label}</p>
            <p className="text-xs text-foreground-muted mt-0.5">
              {action.description}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
