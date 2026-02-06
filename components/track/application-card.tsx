"use client";

import Link from "next/link";
import { FileText, Zap, MoreHorizontal } from "lucide-react";
import type { Application } from "@/lib/data/track";
import type { Job } from "@/lib/data/jobs";

function formatDateAgo(ts: number): string {
  const days = Math.floor((Date.now() - ts) / 86400000);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

export interface ApplicationCardProps {
  application: Application;
  job: Job | undefined;
  /** @deprecated Whole card is draggable; handle not shown */
  dragHandle?: React.ReactNode;
  /** 드래그 직후 클릭 시 상세 페이지 이동 방지 */
  preventLinkNavigation?: boolean;
}

export function ApplicationCard({
  application,
  job,
  dragHandle,
  preventLinkNavigation = false,
}: ApplicationCardProps) {
  if (!job) return null;

  const dateLabel = application.appliedAt
    ? formatDateAgo(application.appliedAt)
    : formatDateAgo(application.addedAt);

  const tags = [job.company, job.companyType].filter(Boolean);

  return (
    <Link
      href={`/track/${application.id}`}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onClickCapture={(e) => {
        if (preventLinkNavigation) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className="group block bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:border-primary-500 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-background-secondary flex items-center justify-center text-xl font-bold text-foreground shrink-0">
          {job.logo}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 rounded-md bg-primary-50 dark:bg-primary-950/40 px-2 py-1">
            <Zap className="w-3 h-3 text-primary-500" />
            <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400">
              {job.match}%
            </span>
          </div>
          <span className="text-[11px] text-foreground-muted">{dateLabel}</span>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-bold text-foreground mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {job.title}
        </h4>
        <p className="text-sm text-foreground-secondary mb-3">{job.company}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-1 bg-background-secondary text-foreground-muted rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border-secondary flex items-center justify-between">
        <div className="flex items-center gap-1">
          {application.hasNotes && (
            <FileText className="w-4 h-4 text-primary-500 shrink-0" />
          )}
        </div>
        <button
          type="button"
          className="p-1 rounded text-foreground-muted hover:text-foreground-secondary hover:bg-background-tertiary transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="더보기"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
}
