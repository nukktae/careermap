"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getJobs } from "@/lib/data/jobs";
import type { JobDetail } from "@/lib/data/jobs";
import { getResumeOptimizerResult } from "@/lib/data/prepare";
import { getMyCvSections, MYCV_SECTION_ORDER, MYCV_SECTION_LABELS } from "@/lib/data/mycv";
import { getFixedCvSections, getFixedCvFullText } from "@/lib/data/fixedcv";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";

const LANGUAGE_OPTIONS = [
  { value: "ko-formal", label: "한국어 경어체" },
  { value: "en", label: "English" },
  { value: "ko-casual", label: "한국어 반말" },
];

/** Rationale for why the optimized CV (fixedcv) was written this way. */
const OPTIMIZATION_RATIONALE = [
  "JD 핵심 키워드(AI 콘텐츠 리서치, 프롬프트, 이미지·영상, 카메라 앱)를 직접적으로 반영",
  "허위 경력 없이 사실 기반으로 구성 (Adobe 툴 경험을 과장하지 않음)",
  "'AI 콘텐츠 실무 지원 + UX 감각을 갖춘 인재'로 포지셔닝",
  "PM·백엔드 중심 이미지는 줄이고, 크리에이티브 및 실행 중심 역량을 강조",
];

/**
 * Mark which words in `after` are changed (true) vs unchanged (false).
 * Uses LCS so only words that don't appear in the same order as in `before` are highlighted.
 */
function getChangedWordMask(before: string, after: string): boolean[] {
  const beforeWords = before.trim().split(/\s+/);
  const afterWords = after.trim().split(/\s+/);
  const m = beforeWords.length;
  const n = afterWords.length;
  if (n === 0) return [];

  // dp[i][j] = LCS length of beforeWords[0..i) and afterWords[0..j)
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (beforeWords[i - 1] === afterWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack: collect indices in after that are part of the LCS
  const afterInLcs = new Set<number>();
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (beforeWords[i - 1] === afterWords[j - 1]) {
      afterInLcs.add(j - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return afterWords.map((_, i) => !afterInLcs.has(i));
}

/** Render optimized text with changed parts bold + primary; newlines preserved. */
function OptimizedWithHighlights({ before, after }: { before: string; after: string }) {
  const lines = after.trim().split(/\n/);
  const changed = getChangedWordMask(before, after);
  let wordIdx = 0;
  return (
    <div className="text-sm text-foreground font-sans leading-relaxed space-y-1.5">
      {lines.map((line, lineIdx) => {
        const lineWords = line.trim() ? line.split(/\s+/) : [];
        if (lineWords.length === 0) return <br key={lineIdx} />;
        return (
          <p key={lineIdx} className="leading-relaxed">
            {lineWords.map((word, i) => {
              const isChanged = wordIdx < changed.length && changed[wordIdx];
              wordIdx += 1;
              return (
                <span key={`${lineIdx}-${i}`}>
                  {i > 0 ? " " : ""}
                  {isChanged ? (
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

function PrepareResumeContent() {
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
    benefits: [],
    deadline: "",
    matchBreakdown: {
      skills: { score: 0, total: 0, matched: [], missing: [] },
      experience: { score: 0, total: 0, note: "" },
      education: { score: 0, total: 0, note: "" },
      projects: { score: 0, total: 0, note: "" },
    },
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

  const cvSections = useMemo(() => getMyCvSections(), []);
  const fixedCvSections = useMemo(() => getFixedCvSections(), []);

  const [language, setLanguage] = useState<string>("ko-formal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof getResumeOptimizerResult>>(null);
  const [usageCount] = useState(1);
  const usageLimit = 1;

  const runOptimize = (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const res = getResumeOptimizerResult(text);
      setResult(res);
      setLoading(false);
    }, 2500);
  };

  const runOptimizeSection = (key: (typeof MYCV_SECTION_ORDER)[number]) => {
    const label = MYCV_SECTION_LABELS[key];
    const content = (cvSections[key] ?? "").trim();
    if (content) runOptimize(`${label}\n${content}`);
  };

  const copyOptimizedCv = () => {
    const full = getFixedCvFullText();
    if (full) navigator.clipboard.writeText(full);
  };
  const copyAfter = () => {
    if (result?.after) navigator.clipboard.writeText(result.after);
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-foreground-muted" />
                mycv.json
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => {
                  const full = MYCV_SECTION_ORDER.map((key) => {
                    const label = MYCV_SECTION_LABELS[key];
                    const content = (cvSections[key] ?? "").trim();
                    return content ? `${label}\n${content}` : "";
                  })
                    .filter(Boolean)
                    .join("\n\n");
                  if (full) runOptimize(full);
                }}
              >
                전체 최적화
              </Button>
            </div>
            <div className="space-y-4">
              {MYCV_SECTION_ORDER.map((key) => {
                const content = (cvSections[key] ?? "").trim();
                if (!content) return null;
                const label = MYCV_SECTION_LABELS[key];
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-background-secondary/50">
                      <h3 className="font-semibold text-foreground text-sm">
                        {label}
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={loading}
                        onClick={() => runOptimizeSection(key)}
                      >
                        이 섹션 최적화
                      </Button>
                    </div>
                    <div className="p-4">
                      <pre className="text-sm text-foreground-secondary whitespace-pre-wrap font-sans leading-relaxed">
                        {content}
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <header className="px-4 py-3 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground text-sm">최적화 결과</h3>
              <p className="text-xs text-foreground-muted mt-0.5">
                변경된 부분은 <span className="font-semibold text-primary-600 dark:text-primary-400">굵게·브랜드 컬러</span>로 표시돼요
              </p>
            </header>
            <div className="p-4 space-y-6">
              {MYCV_SECTION_ORDER.map((key) => {
                const afterContent = (fixedCvSections[key] ?? "").trim();
                if (!afterContent) return null;
                const beforeContent = (cvSections[key] ?? "").trim();
                const label = MYCV_SECTION_LABELS[key];
                return (
                  <section key={key} className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider border-b border-border pb-1.5">
                      {label}
                    </h4>
                    <OptimizedWithHighlights before={beforeContent} after={afterContent} />
                  </section>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={copyOptimizedCv}>
              복사
            </Button>
            <Button size="sm" variant="outline">
              프로필에 적용
            </Button>
            {result && (
              <Button size="sm" variant="outline" disabled={loading} onClick={() => runOptimize(result.before)}>
                다시 생성
              </Button>
            )}
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">
              왜 이렇게 바뀌었나요?
            </h3>
            <ul className="space-y-2 text-sm text-foreground-secondary">
              {OPTIMIZATION_RATIONALE.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" aria-hidden>
                    ✔
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrepareResumePage() {
  return (
    <Suspense fallback={<div className="space-y-6 h-64 animate-pulse rounded-lg bg-background-secondary" />}>
      <PrepareResumeContent />
    </Suspense>
  );
}
