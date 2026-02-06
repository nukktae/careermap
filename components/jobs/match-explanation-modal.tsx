"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { JobDetail } from "@/lib/data/jobs";

export interface MatchExplanationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobDetail | null;
}

export function MatchExplanationModal({
  open,
  onOpenChange,
  job,
}: MatchExplanationModalProps) {
  if (!job) return null;

  const { match, title, company, badge, matchBreakdown } = job;
  const badgeClass =
    badge === "apply"
      ? "text-success-600 dark:text-success-400"
      : badge === "prep"
        ? "text-warning-600 dark:text-warning-400"
        : "text-error-600 dark:text-error-400";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col sm:rounded-2xl border border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground pr-8">
            {title} · {company}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-y-auto -mx-1 px-1">
          {/* Overall score */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-16 h-16 -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-background-secondary"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={`${match * 1.76} 176`}
                  strokeLinecap="round"
                  className={
                    badge === "apply"
                      ? "text-success-500"
                      : badge === "prep"
                        ? "text-warning-500"
                        : "text-error-500"
                  }
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${badgeClass}`}>
                  {match}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-foreground-secondary">
                이 점수는 4가지 요소로 계산됩니다
              </p>
            </div>
          </div>

          {/* Skills (40%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                기술 스킬 (40%)
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchBreakdown.skills.score}/{matchBreakdown.skills.total}
              </span>
            </div>
            <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{
                  width: `${(matchBreakdown.skills.score / matchBreakdown.skills.total) * 100}%`,
                }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchBreakdown.skills.matched.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 text-xs"
                >
                  <Check className="w-3 h-3" />
                  {skill}
                </span>
              ))}
              {matchBreakdown.skills.missing.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 text-xs"
                >
                  <X className="w-3 h-3" />
                  {skill}
                </span>
              ))}
            </div>
            {matchBreakdown.skills.skillsImpact && (
              <p className="text-xs text-foreground-secondary">
                {matchBreakdown.skills.skillsImpact}
              </p>
            )}
          </div>

          {/* Experience (30%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                경력 (30%)
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchBreakdown.experience.score}/{matchBreakdown.experience.total}
              </span>
            </div>
            <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{
                  width: `${(matchBreakdown.experience.score / matchBreakdown.experience.total) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-foreground-secondary">
              {matchBreakdown.experience.note}
            </p>
            {matchBreakdown.experience.experienceGap && (
              <p className="text-xs text-primary-600 dark:text-primary-400">
                {matchBreakdown.experience.experienceGap}
              </p>
            )}
          </div>

          {/* Education (15%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                학력 (15%)
              </span>
              <span className="text-sm font-semibold text-success-600 dark:text-success-400">
                {matchBreakdown.education.score}/{matchBreakdown.education.total}
              </span>
            </div>
            <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-success-500 rounded-full"
                style={{
                  width: `${(matchBreakdown.education.score / matchBreakdown.education.total) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-foreground-secondary">
              {matchBreakdown.education.educationNote ?? matchBreakdown.education.note}
            </p>
          </div>

          {/* Projects (15%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                프로젝트 (15%)
              </span>
              <span className="text-sm font-semibold text-foreground">
                {matchBreakdown.projects.score}/{matchBreakdown.projects.total}
              </span>
            </div>
            <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{
                  width: `${(matchBreakdown.projects.score / matchBreakdown.projects.total) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-foreground-secondary">
              {matchBreakdown.projects.note}
            </p>
            {matchBreakdown.projects.projectsImprovement && (
              <p className="text-xs text-primary-600 dark:text-primary-400">
                {matchBreakdown.projects.projectsImprovement}
              </p>
            )}
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex flex-col gap-2 pt-2 border-t border-border">
          <Button asChild className="w-full">
            <Link href={`/prepare/skills?job=${job.id}`} onClick={() => onOpenChange(false)}>
              2주 준비 플랜 보기
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/prepare/resume" onClick={() => onOpenChange(false)}>
              이력서 최적화하기
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
