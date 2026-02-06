"use client";

import Link from "next/link";
import { AppIcon } from "@/components/ui/app-icon";
import type { MatchSummary } from "@/lib/data/dashboard";

interface MatchingStatusCardProps {
  summary: MatchSummary;
}

const statConfig = [
  {
    key: "applyNow" as const,
    label: "적정 지원",
    bgClass: "bg-primary-50 dark:bg-primary-950/30 border-primary-100 dark:border-primary-900/50",
    textClass: "text-primary-600 dark:text-primary-400",
  },
  {
    key: "prepNeeded" as const,
    label: "준비 필요",
    bgClass: "bg-warning-50 dark:bg-warning-950/30 border-warning-100 dark:border-warning-900/50",
    textClass: "text-warning-600 dark:text-warning-400",
  },
  {
    key: "stretchGoal" as const,
    label: "지원 위험",
    bgClass: "bg-error-50 dark:bg-error-950/30 border-error-100 dark:border-error-900/50",
    textClass: "text-error-600 dark:text-error-400",
  },
];

export function MatchingStatusCard({ summary }: MatchingStatusCardProps) {
  return (
    <section
      id="matching-status"
      className="col-span-12 lg:col-span-7 bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm"
      aria-labelledby="matching-status-heading"
    >
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h2
            id="matching-status-heading"
            className="text-xl font-bold text-foreground"
          >
            내 매칭 현황
          </h2>
          <p className="text-sm text-foreground-muted mt-1">
            총{" "}
            <span className="text-foreground font-semibold">
              {summary.total}개
            </span>
            의 매칭된 채용이 있습니다
          </p>
        </div>
        <Link
          href="/jobs"
          className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1 shrink-0"
        >
          모든 채용 보기
          <AppIcon name="arrow-right" className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {statConfig.map(({ key, label, bgClass, textClass }) => (
          <div
            key={key}
            className={`p-4 sm:p-6 rounded-2xl border ${bgClass}`}
          >
            <p className={`text-sm font-medium mb-2 ${textClass}`}>{label}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">
                {summary[key]}
              </span>
              <span className="text-sm text-foreground-muted mb-1">개</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
