"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getJobs } from "@/lib/data/jobs";
import type { JobDetail } from "@/lib/data/jobs";
import {
  getResumeOptimizerDefaults,
  getResumeOptimizerResult,
} from "@/lib/data/prepare";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGE_OPTIONS = [
  { value: "ko-formal", label: "한국어 경어체" },
  { value: "en", label: "English" },
  { value: "ko-casual", label: "한국어 반말" },
];

export default function PrepareResumePage() {
  const searchParams = useSearchParams();
  const jobsFromData = getJobs();
  const jobParam = searchParams.get("job");
  const urlJobId = jobParam ? parseInt(jobParam, 10) : null;
  const hasUrlJobNotInList =
    urlJobId != null &&
    !Number.isNaN(urlJobId) &&
    !jobsFromData.some((j) => j.id === urlJobId);

  const syntheticJob: JobDetail = {
    id: urlJobId!,
    company: "선택한 채용",
    title: `채용 #${urlJobId}`,
    location: "",
    locationFilter: "seoul",
    type: "",
    typeValue: "fulltime",
    experience: "",
    experienceLevel: "신입",
    match: 0,
    badge: "prep",
    logo: "",
    matchedSkills: [],
    missingSkills: [],
    salary: "",
    salaryMin: 0,
    salaryMax: 0,
    companyType: "스타트업",
    industry: "IT",
    postedAt: "",
    description: "",
    responsibilities: [],
    requirements: [],
    preferred: [],
  };

  const jobs: JobDetail[] =
    hasUrlJobNotInList && urlJobId != null
      ? [syntheticJob, ...jobsFromData]
      : jobsFromData;

  const initialId =
    urlJobId != null && !Number.isNaN(urlJobId)
      ? String(urlJobId)
      : String(jobsFromData[0]?.id ?? "1");
  const [targetJobId, setTargetJobId] = useState<string>(initialId);

  const samples = getResumeOptimizerDefaults();
  const [language, setLanguage] = useState<string>("ko-formal");
  const [beforeText, setBeforeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof getResumeOptimizerResult>>(null);
  const [usageCount] = useState(1);
  const usageLimit = 1;

  const fillFromProfile = (index: number) => {
    const sample = samples[index];
    if (sample) setBeforeText(sample.before);
  };

  const runOptimize = () => {
    if (!beforeText.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const res = getResumeOptimizerResult(beforeText);
      setResult(res);
      setLoading(false);
    }, 2500);
  };

  const copyAfter = () => {
    if (result?.after) {
      navigator.clipboard.writeText(result.after);
      // Could add toast
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          이력서 최적화
        </h1>
        <p className="text-foreground-secondary">
          지원 직무에 맞게 문장을 다듬고 키워드와 성과를 강조하세요.
        </p>
      </div>

      <div className="text-sm text-foreground-muted">
        이번 달 사용: {usageCount}/{usageLimit} (무료) · 프리미엄으로 무제한 이용
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              대상 채용
            </label>
            <Select value={targetJobId} onValueChange={setTargetJobId}>
              <SelectTrigger>
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
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              언어
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              현재 문장
            </label>
            <Textarea
              placeholder="이력서 문장을 붙여넣거나 아래에서 선택하세요."
              value={beforeText}
              onChange={(e) => setBeforeText(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-foreground-muted">프로필에서:</span>
              {samples.map((s, i) => (
                <Button
                  key={i}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillFromProfile(i)}
                >
                  예시 {i + 1}
                </Button>
              ))}
            </div>
          </div>
          <Button
            onClick={runOptimize}
            disabled={!beforeText.trim() || loading}
            className="w-full"
          >
            {loading ? "AI가 최적화 중..." : "최적화하기"}
          </Button>
        </div>

        <div className="space-y-4">
          {result && (
            <>
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-semibold text-foreground mb-2">비교</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-foreground-muted mb-1">원문</p>
                    <p className="text-sm text-foreground-secondary whitespace-pre-wrap">
                      {result.before}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted mb-1">최적화</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {result.after}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  왜 이렇게 바뀌었나요?
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground-secondary">
                  {result.explanation.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={copyAfter}>
                  복사
                </Button>
                <Button size="sm" variant="outline">
                  프로필에 적용
                </Button>
                <Button size="sm" variant="outline" onClick={runOptimize}>
                  다시 생성
                </Button>
              </div>
            </>
          )}
          {!result && !loading && (
            <div className="bg-background-secondary rounded-xl border border-border p-8 text-center text-foreground-muted text-sm">
              문장을 입력하고 최적화하기를 누르면 결과가 여기에 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
