"use client";

import Link from "next/link";
import { Bookmark, Building2, ChevronRight, MapPin } from "lucide-react";
import { Check } from "lucide-react";
import type { Job, MatchBadge } from "@/lib/data/jobs";

function getBadgeStyle(badge: MatchBadge): string {
  switch (badge) {
    case "apply":
      return "match-high";
    case "prep":
      return "match-medium";
    case "stretch":
      return "match-low";
    default:
      return "";
  }
}

function getBadgeLabel(badge: MatchBadge): string {
  switch (badge) {
    case "apply":
      return "지원 가능";
    case "prep":
      return "준비 필요";
    case "stretch":
      return "도전 목표";
    default:
      return "";
  }
}

export interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (jobId: number, e: React.MouseEvent) => void;
  href: string;
}

export function JobCard({ job, isSaved, onToggleSave, href }: JobCardProps) {
  return (
    <Link
      href={href}
      className="bg-card rounded-xl border border-border p-5 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-background-secondary flex items-center justify-center text-foreground font-bold text-lg group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30 transition-colors">
            {job.logo}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-foreground-secondary">{job.company}</p>
          </div>
        </div>
        <button
          onClick={(e) => onToggleSave(job.id, e)}
          className={`p-2 rounded-lg transition-colors ${
            isSaved
              ? "text-primary-500 bg-primary-50 dark:bg-primary-950/30"
              : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
          }`}
        >
          <Bookmark
            className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 text-sm text-foreground-secondary">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Building2 className="w-4 h-4" />
          {job.type}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-background-secondary"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${job.match * 1.51} 151`}
                strokeLinecap="round"
                className={
                  job.badge === "apply"
                    ? "text-success-500"
                    : job.badge === "prep"
                      ? "text-warning-500"
                      : "text-error-500"
                }
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">
                {job.match}%
              </span>
            </div>
          </div>
          <div>
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(
                job.badge
              )}`}
            >
              {getBadgeLabel(job.badge)}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-primary-500 transition-colors" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.matchedSkills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 text-xs"
          >
            <Check className="w-3 h-3" />
            {skill}
          </span>
        ))}
        {job.missingSkills.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 rounded-full bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 text-xs"
          >
            {skill}
          </span>
        ))}
      </div>
    </Link>
  );
}
