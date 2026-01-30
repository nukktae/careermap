"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
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

function getMatchClass(match: number): string {
  if (match >= 85) return "match-high";
  if (match >= 60) return "match-medium";
  return "match-low";
}

export interface ApplicationCardProps {
  application: Application;
  job: Job | undefined;
  dragHandle?: React.ReactNode;
}

export function ApplicationCard({
  application,
  job,
  dragHandle,
}: ApplicationCardProps) {
  if (!job) return null;
  const dateLabel = application.appliedAt
    ? formatDateAgo(application.appliedAt)
    : formatDateAgo(application.addedAt);

  return (
    <Link
      href={`/track/${application.id}`}
      className="bg-card rounded-xl border border-border p-4 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all block group"
    >
      <div className="flex items-start gap-3">
        {dragHandle && (
          <div
            className="shrink-0 cursor-grab active:cursor-grabbing text-foreground-muted hover:text-foreground"
            onClick={(e) => e.preventDefault()}
          >
            {dragHandle}
          </div>
        )}
        <div className="w-10 h-10 rounded-lg bg-background-secondary flex items-center justify-center text-foreground font-bold shrink-0 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30 transition-colors">
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary-600 dark:group-hover:text-primary-400">
            {job.title}
          </h3>
          <p className="text-xs text-foreground-secondary truncate">
            {job.company}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getMatchClass(
                job.match
              )}`}
            >
              {job.match}%
            </span>
            <span className="text-xs text-foreground-muted">{dateLabel}</span>
            {application.hasNotes && (
              <FileText className="w-3.5 h-3.5 text-primary-500 shrink-0" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
