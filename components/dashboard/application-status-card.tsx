"use client";

import Link from "next/link";
import { AppIcon } from "@/components/ui/app-icon";
import type { ApplicationSummary } from "@/lib/data/dashboard";

interface ApplicationStatusCardProps {
  summary: ApplicationSummary;
}

const statusConfig = [
  {
    key: "applied" as const,
    label: "지원함",
    icon: "document-text" as const,
  },
  {
    key: "interview" as const,
    label: "면접",
    icon: "message-text" as const,
  },
  {
    key: "offer" as const,
    label: "합격",
    icon: "tick-circle" as const,
  },
];

export function ApplicationStatusCard({ summary }: ApplicationStatusCardProps) {
  return (
    <section
      id="application-status"
      className="col-span-12 lg:col-span-5 bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm"
      aria-labelledby="application-status-heading"
    >
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2
          id="application-status-heading"
          className="text-xl font-bold text-foreground"
        >
          지원 현황
        </h2>
        <Link
          href="/track"
          className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1 shrink-0"
        >
          지원 현황 보기
          <AppIcon name="arrow-right" className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex items-center justify-around py-4">
        {statusConfig.map((item, index) => (
          <div key={item.key} className="flex items-center flex-1 min-w-0">
            {index > 0 && (
              <div
                className="w-px h-12 bg-border shrink-0 hidden sm:block"
                aria-hidden
              />
            )}
            <div className="flex-1 text-center group cursor-default min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-background-secondary text-foreground-muted group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all mb-3 mx-auto">
                <AppIcon name={item.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className="text-sm font-medium text-foreground-muted">
                {item.label}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                {summary[item.key]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
