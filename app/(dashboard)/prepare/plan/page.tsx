"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { AppIcon } from "@/components/ui/app-icon";
import {
  getLearningPlan,
  getCompletedTaskIds,
  setCompletedTaskIds,
} from "@/lib/data/prepare";

function PreparePlanContent() {
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("job");
  const jobId = jobIdParam ? parseInt(jobIdParam, 10) : null;
  const plan = jobId != null && !Number.isNaN(jobId) ? getLearningPlan(jobId) : undefined;

  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || jobId == null || Number.isNaN(jobId)) return;
    setCompletedIds(getCompletedTaskIds(jobId));
  }, [mounted, jobId]);

  const toggleTask = useCallback(
    (taskId: string) => {
      if (jobId == null) return;
      setCompletedIds((prev) => {
        const next = prev.includes(taskId)
          ? prev.filter((id) => id !== taskId)
          : [...prev, taskId];
        setCompletedTaskIds(jobId, next);
        return next;
      });
    },
    [jobId]
  );

  if (jobId == null || Number.isNaN(jobId) || !plan) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            학습 플랜
          </h1>
          <p className="text-foreground-secondary">
            채용을 선택해 주세요
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <p className="text-foreground-secondary mb-4">
            채용 상세에서 "이 채용 준비하기"를 누르거나, 채용 목록에서 플랜을 만들 채용을 선택해 주세요.
          </p>
          <Button asChild>
            <Link href="/jobs">채용 찾기</Link>
          </Button>
        </div>
      </div>
    );
  }

  const allTaskIds = plan.weeks.flatMap((w) => w.tasks.map((t) => t.id));
  const totalTasks = allTaskIds.length;
  const completedCount = completedIds.filter((id) => allTaskIds.includes(id)).length;
  const progressPercent = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {plan.jobTitle} · {plan.company}
        </h1>
        <p className="text-foreground-secondary">
          현재 매칭 {plan.currentMatch}% → 목표 {plan.targetMatch}% · {plan.weeks.length}주 플랜
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            진행률
          </span>
          <span className="text-sm font-medium text-foreground">
            {completedCount} / {totalTasks} 완료
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <div className="space-y-6">
        {plan.weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <h2 className="font-semibold text-foreground p-4 border-b border-border">
              {week.title}
            </h2>
            <ul className="divide-y divide-border">
              {week.tasks.map((task) => {
                const isCompleted = completedIds.includes(task.id);
                return (
                  <li key={task.id} className="p-4 flex items-start gap-3">
                    <Checkbox
                      id={task.id}
                      checked={isCompleted}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={task.id}
                        className={`font-medium text-foreground cursor-pointer ${
                          isCompleted ? "line-through text-foreground-muted" : ""
                        }`}
                      >
                        {task.label}
                      </label>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-foreground-secondary">
                        <span className="flex items-center gap-1">
                          <AppIcon name="clock" className="w-4 h-4" />
                          약 {task.estimatedHours}시간
                        </span>
                        {task.resourceUrl && task.resourceLabel && (
                          <a
                            href={task.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-500 hover:underline"
                          >
                            {task.resourceLabel}
                          </a>
                        )}
                        {task.type === "resume" && (
                          <Button asChild size="sm" variant="outline" className="mt-1">
                            <Link href="/prepare/resume">이력서 업데이트</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PreparePlanPage() {
  return (
    <Suspense fallback={<div className="space-y-6"><div className="h-8 w-48 bg-background-secondary rounded animate-pulse" /><div className="h-32 bg-background-secondary rounded-xl animate-pulse" /></div>}>
      <PreparePlanContent />
    </Suspense>
  );
}
