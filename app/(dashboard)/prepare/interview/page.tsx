"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/app-icon";
import { ChevronDown, ChevronUp, Target, Lock } from "lucide-react";
import { getJobs } from "@/lib/data/jobs";
import { getInterviewPrep } from "@/lib/data/prepare";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PrepareInterviewContent() {
  const searchParams = useSearchParams();
  const jobs = getJobs();
  const jobParam = searchParams.get("job");
  const urlJobId = jobParam ? parseInt(jobParam, 10) : null;
  const validJobId =
    jobParam != null && urlJobId != null && !Number.isNaN(urlJobId)
      ? urlJobId
      : null;
  const initialJobId =
    urlJobId != null &&
    !Number.isNaN(urlJobId) &&
    jobs.some((j) => j.id === urlJobId)
      ? String(urlJobId)
      : String(jobs[0]?.id ?? "1");
  const [jobId, setJobId] = useState<string>(initialJobId);
  const numId = jobId ? parseInt(jobId, 10) : 1;
  const data = getInterviewPrep(Number.isNaN(numId) ? 1 : numId);
  const [expandedPractice, setExpandedPractice] = useState<number | null>(null);

  if (!validJobId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            면접 준비
          </h1>
          <p className="text-foreground-secondary">
            질문 유형, 스토리 매핑, 회사 문화, 한국형 면접 포맷을 확인하세요. 위에서 저장한 채용을 선택하거나 아래에서 채용 찾기로 이동하세요.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <Target className="mx-auto h-12 w-12 text-foreground-muted mb-4" />
          <p className="text-foreground-secondary mb-4">
            비교할 채용을 선택해 주세요
          </p>
          <Button asChild>
            <Link href="/jobs">채용 찾기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          면접 준비
        </h1>
        <p className="text-foreground-secondary">
          질문 유형, 스토리 매핑, 회사 문화, 한국형 면접 포맷을 확인하세요.
        </p>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800">
        <AppIcon name="crown" className="w-5 h-5 text-primary-500 shrink-0" />
        <span className="text-sm font-medium text-foreground">프리미엄</span>
        <Button size="sm" className="ml-auto">
          업그레이드
        </Button>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          대상 채용
        </label>
        <Select value={jobId} onValueChange={setJobId}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="채용 선택" />
          </SelectTrigger>
          <SelectContent>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={String(job.id)}>
                {job.company} · {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!data && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Lock className="mx-auto h-12 w-12 text-foreground-muted mb-4" />
          <p className="text-foreground-secondary font-medium mb-1">프리미엄 전용</p>
          <p className="text-sm text-foreground-muted mb-6">
            질문 유형, 스토리 매핑, 회사 문화, 한국형 면접 포맷은 프리미엄에서 이용할 수 있습니다.
          </p>
          <Button>업그레이드</Button>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AppIcon name="message-question" className="w-5 h-5 text-primary-500" />
              예상 질문 유형
            </h3>
            <div className="space-y-3">
              {data.questionCategories.map((cat, i) => (
                <div key={i}>
                  <p className="font-medium text-foreground text-sm mb-1">{cat.name}</p>
                  <ul className="list-disc list-inside text-sm text-foreground-secondary">
                    {cat.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AppIcon name="lamp" className="w-5 h-5 text-primary-500" />
              이력서 스토리 매핑
            </h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              {data.resumeStoryMapping.map((m, i) => (
                <li key={i}>
                  <span className="font-medium text-foreground">{m.topic}:</span> {m.story}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">
              회사 문화 프레이밍
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-foreground-secondary">
              {data.companyCultureFraming.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">
              연습 질문 (답변 프레임만)
            </h3>
            <div className="space-y-2">
              {data.practiceQuestions.map((q, i) => (
                <div
                  key={i}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-background-secondary transition-colors"
                    onClick={() =>
                      setExpandedPractice(expandedPractice === i ? null : i)
                    }
                  >
                    <span className="text-sm font-medium text-foreground">
                      {q.question}
                    </span>
                    {expandedPractice === i ? (
                      <ChevronUp className="w-4 h-4 text-foreground-muted shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-foreground-muted shrink-0" />
                    )}
                  </button>
                  {expandedPractice === i && (
                    <div className="px-3 pb-3 pt-0 text-sm text-foreground-secondary border-t border-border">
                      {q.framework}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">
              면접 포맷 가이드 (한국)
            </h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              {data.formatGuide.map((f, i) => (
                <li key={i}>
                  <span className="font-medium text-foreground">{f.name}:</span> {f.tips}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PrepareInterviewPage() {
  return (
    <Suspense fallback={<div className="space-y-6 h-64 animate-pulse rounded-lg bg-background-secondary" />}>
      <PrepareInterviewContent />
    </Suspense>
  );
}
