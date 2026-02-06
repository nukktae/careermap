"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppIcon } from "@/components/ui/app-icon";
import { getJobs } from "@/lib/data/jobs";
import {
  getCoverLetterPrompts,
  getCoverLetterGuidance,
} from "@/lib/data/prepare";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PrepareCoverLetterPage() {
  const searchParams = useSearchParams();
  const jobs = getJobs();
  const jobParam = searchParams.get("job");
  const urlJobId = jobParam ? parseInt(jobParam, 10) : null;
  const initialCompanyId =
    urlJobId != null &&
    !Number.isNaN(urlJobId) &&
    jobs.some((j) => j.id === urlJobId)
      ? String(urlJobId)
      : String(jobs[0]?.id ?? "1");
  const prompts = getCoverLetterPrompts();
  const [companyId, setCompanyId] = useState<string>(initialCompanyId);
  const [promptId, setPromptId] = useState<string>(prompts[0]?.id ?? "motivation");
  const [customPrompt, setCustomPrompt] = useState("");
  const numId = companyId ? parseInt(companyId, 10) : 1;
  const guidance = getCoverLetterGuidance(Number.isNaN(numId) ? 1 : numId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          자소서 가이드
        </h1>
        <p className="text-foreground-secondary">
          회사·질문별 구조, 강조할 경험, 샘플 문장 가이드를 받으세요.
        </p>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800">
        <AppIcon name="crown" className="w-5 h-5 text-primary-500 shrink-0" />
        <span className="text-sm font-medium text-foreground">프리미엄</span>
        <Button size="sm" className="ml-auto">
          업그레이드
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              대상 회사
            </label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger>
                <SelectValue placeholder="회사 선택" />
              </SelectTrigger>
              <SelectContent>
                {jobs.slice(0, 6).map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              자소서 질문
            </label>
            <Select value={promptId} onValueChange={setPromptId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {prompts.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {promptId === "custom" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                직접 입력
              </label>
              <Input
                placeholder="질문을 입력하세요"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {guidance && (
            <>
              <p className="text-xs text-foreground-muted italic">
                이것은 가이드일 뿐, 복사-붙여넣기 하지 마세요.
              </p>
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  구조 추천
                </h3>
                <ul className="space-y-2 text-sm text-foreground-secondary">
                  <li><strong className="text-foreground">서론:</strong> {guidance.structure.intro}</li>
                  <li><strong className="text-foreground">본문:</strong> {guidance.structure.body}</li>
                  <li><strong className="text-foreground">결론:</strong> {guidance.structure.conclusion}</li>
                </ul>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  강조할 경험
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground-secondary">
                  {guidance.experiencesToEmphasize.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  회사 가치 정렬
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground-secondary">
                  {guidance.valuesAlignment.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  샘플 문장 (가이드)
                </h3>
                <ul className="space-y-2 text-sm text-foreground-secondary">
                  {guidance.samplePhrases.map((s, i) => (
                    <li key={i}>
                      <span className="font-medium text-foreground">{s.label}:</span> {s.phrase}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
