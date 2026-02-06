"use client";

import Link from "next/link";
import { Bookmark, MapPin } from "lucide-react";
import { AppIcon } from "@/components/ui/app-icon";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import type { DashboardRecentJob } from "@/lib/data/dashboard";

interface RecentJobsSectionProps {
  jobs: DashboardRecentJob[];
}

function DashboardJobCard({
  job,
  isSaved,
  onToggleSave,
}: {
  job: DashboardRecentJob;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
}) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-border shadow-sm hover:shadow-md transition-all p-6"
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-4 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-background-secondary flex items-center justify-center overflow-hidden border border-border shrink-0">
            {job.logoUrl ? (
              <img
                src={job.logoUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-foreground">{job.logo}</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-gray-500 dark:text-foreground-secondary font-medium truncate">
              {job.company}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 shrink-0">
          <div className="text-right">
            <div className="text-primary-500 font-bold text-xl">{job.match}%</div>
            <span className="inline-block text-[11px] px-2 py-1 rounded-md font-bold bg-primary-badge text-primary-badge-text">
              매칭
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleSave}
            className={`p-2 rounded-lg transition-colors ${
              isSaved
                ? "text-primary-500 bg-primary-50 dark:bg-primary-950/30"
                : "text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            aria-label={isSaved ? "저장 취소" : "저장"}
          >
            <Bookmark
              className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
              aria-hidden
            />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-foreground-secondary">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 shrink-0" />
          {job.location}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-border">
        <span className="text-xs text-foreground-muted">{job.updatedAt} 업데이트</span>
      </div>
    </Link>
  );
}

export function RecentJobsSection({ jobs }: RecentJobsSectionProps) {
  const { isSaved, toggleSaved } = useSavedJobs();

  return (
    <section
      id="recent-jobs"
      className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm"
      aria-labelledby="recent-jobs-heading"
    >
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2
          id="recent-jobs-heading"
          className="text-xl font-bold text-foreground"
        >
          최근 매칭된 채용
        </h2>
        <Link
          href="/jobs"
          className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1 shrink-0"
        >
          전체 보기
          <AppIcon name="arrow-right" className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {jobs.map((job) => (
          <DashboardJobCard
            key={job.id}
            job={job}
            isSaved={isSaved(job.id)}
            onToggleSave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaved(job.id);
            }}
          />
        ))}
      </div>
    </section>
  );
}
