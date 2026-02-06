"use client";

import Link from "next/link";
import { Bookmark, Building2, MapPin } from "lucide-react";
import { Check } from "lucide-react";
import type { Job, MatchBadge } from "@/lib/data/jobs";

const COMPANY_LOGO_COLORS = [
  { bg: "bg-[#03C75A]", text: "text-white" },
  { bg: "bg-[#1062FE]", text: "text-white" },
  { bg: "bg-[#2AC1BC]", text: "text-white" },
  { bg: "bg-[#A31411]", text: "text-white" },
  { bg: "bg-[#FEE500]", text: "text-[#3C1E1E]" },
  { bg: "bg-[#FF7E36]", text: "text-white" },
  { bg: "bg-[#00C300]", text: "text-white" },
  { bg: "bg-[#FFBB00]", text: "text-black" },
  { bg: "bg-primary-500", text: "text-white" },
] as const;

function getCompanyLogoColor(company: string): (typeof COMPANY_LOGO_COLORS)[number] {
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = (hash << 5) - hash + company.charCodeAt(i);
  const index = Math.abs(hash) % COMPANY_LOGO_COLORS.length;
  return COMPANY_LOGO_COLORS[index];
}

function getBadgeStyles(badge: MatchBadge): { wrapper: string; label: string } {
  switch (badge) {
    case "apply":
      return {
        wrapper: "bg-primary-badge text-primary-badge-text",
        label: "지원 가능",
      };
    case "prep":
      return {
        wrapper: "bg-warning-badge text-warning-600 dark:text-warning-400",
        label: "준비 필요",
      };
    case "stretch":
      return {
        wrapper: "bg-neutral-badge text-neutral-badge-text",
        label: "도전 목표",
      };
    default:
      return { wrapper: "", label: "" };
  }
}

export interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (jobId: number, e: React.MouseEvent) => void;
  href: string;
}

export function JobCard({ job, isSaved, onToggleSave, href }: JobCardProps) {
  const logoColor = getCompanyLogoColor(job.company);
  const badgeStyles = getBadgeStyles(job.badge);

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-border shadow-sm hover:shadow-md transition-all p-6"
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-4 min-w-0">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden ${logoColor.bg} ${logoColor.text}`}
          >
            {job.logoUrl ? (
              <img src={job.logoUrl} alt="" className="object-contain w-full h-full" />
            ) : (
              job.logo
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
            <span
              className={`inline-block text-[11px] px-2 py-1 rounded-md font-bold ${badgeStyles.wrapper}`}
            >
              {badgeStyles.label}
            </span>
          </div>
          <button
            onClick={(e) => onToggleSave(job.id, e)}
            className={`p-2 rounded-lg transition-colors ${
              isSaved
                ? "text-primary-500 bg-primary-50 dark:bg-primary-950/30"
                : "text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            aria-label={isSaved ? "저장 취소" : "저장"}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500 dark:text-foreground-secondary">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 shrink-0" />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Building2 className="w-4 h-4 shrink-0" />
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {job.matchedSkills.slice(0, 5).map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400"
          >
            <Check className="w-3 h-3 shrink-0" />
            {skill}
          </span>
        ))}
        {job.missingSkills.slice(0, 5).map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400"
          >
            {skill}
          </span>
        ))}
      </div>
    </Link>
  );
}
