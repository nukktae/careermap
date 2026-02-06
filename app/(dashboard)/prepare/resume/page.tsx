"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getJobs, getJobById } from "@/lib/data/jobs";
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
import Link from "next/link";
import { FileText, Target, Sparkles, RotateCcw, Wand2, Copy, Check, Sliders, Lightbulb } from "lucide-react";

const LANGUAGE_OPTIONS = [
  { value: "ko-formal", label: "한국어 (정중한 경어체)" },
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

  return afterWords.map((_, idx) => !afterInLcs.has(idx));
}

/** Render optimized text with changed parts bold + primary; newlines preserved. */
function OptimizedWithHighlights({ before, after }: { before: string; after: string }) {
  const lines = after.trim().split(/\n/);
  const changed = getChangedWordMask(before, after);
  let wordIdx = 0;
  return (
    <div className="text-sm text-slate-700 font-sans leading-relaxed space-y-1.5">
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
                    <span className="font-bold text-[#2463E9] bg-blue-50 px-1 rounded">{word}</span>
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

  const validJobId =
    jobParam != null && urlJobId != null && !Number.isNaN(urlJobId)
      ? urlJobId
      : null;

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
  const [intensity, setIntensity] = useState<"natural" | "keyword">("keyword");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [appliedSections, setAppliedSections] = useState<Partial<Record<string, string>>>({});

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

  const runFullOptimize = () => {
    const full = MYCV_SECTION_ORDER.map((key) => {
      const label = MYCV_SECTION_LABELS[key];
      const content = (cvSections[key] ?? "").trim();
      return content ? `${label}\n${content}` : "";
    })
      .filter(Boolean)
      .join("\n\n");
    if (full) runOptimize(full);
  };

  const copyOptimizedCv = () => {
    const full = getFixedCvFullText();
    if (full) navigator.clipboard.writeText(full);
  };
  const copyAfter = () => {
    if (result?.after) navigator.clipboard.writeText(result.after);
  };

  const copySectionOptimized = (key: string, text: string) => {
    if (text) navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  const applySection = (key: string, optimizedText: string) => {
    if (!optimizedText) return;
    setAppliedSections((prev) => ({ ...prev, [key]: optimizedText }));
    navigator.clipboard.writeText(optimizedText);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const targetJob = useMemo(
    () => (targetJobId ? getJobById(parseInt(targetJobId, 10)) ?? jobs.find((j) => String(j.id) === targetJobId) : null),
    [targetJobId, jobs]
  );

  if (!validJobId) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">이력서 최적화</h1>
          <p className="text-slate-500">
            지원 직무에 맞게 문장을 다듬고 키워드와 성과를 강조하세요. 위에서 저장한 채용을 선택하거나 아래에서 채용 찾기로 이동하세요.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Target className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 mb-4">비교할 채용을 선택해 주세요</p>
          <Button asChild className="bg-[#2463E9] hover:bg-[#1d4fd7]">
            <Link href="/jobs">채용 찾기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
              이력서 AI 최적화
            </h2>
            <p className="text-slate-500">
              지원하시는 공고의 직무 역량에 맞춰 이력서를 전략적으로 재구성합니다.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              className="border-slate-200 text-slate-700 rounded-xl font-bold"
              onClick={() => setResult(null)}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
            <Button
              type="button"
              disabled={loading}
              className="bg-[#2463E9] hover:bg-[#1d4fd7] text-white rounded-xl font-bold shadow-lg shadow-blue-100"
              onClick={runFullOptimize}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              전체 최적화 실행
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Comparison view */}
        <div className="lg:col-span-8 space-y-8">
          {/* Comparison header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                원본 이력서
              </h3>
              <div className="w-6 h-px bg-slate-200" />
              <h3 className="text-sm font-bold text-[#2463E9] uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI 최적화 결과
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-[#2463E9]" />
              최적화된 키워드 강조
            </div>
          </div>

          {/* Section pairs: Original | Optimized */}
          {MYCV_SECTION_ORDER.map((key, sectionIndex) => {
            const beforeContent = (cvSections[key] ?? "").trim();
            const afterContent = (fixedCvSections[key] ?? "").trim();
            if (!beforeContent && !afterContent) return null;

            const label = MYCV_SECTION_LABELS[key];
            const sectionNum = String(sectionIndex + 1).padStart(2, "0");
            const displayContent = appliedSections[key] ?? beforeContent;
            const isApplied = !!appliedSections[key];

            return (
              <div
                key={key}
                id={`section-${key}`}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Original card (updates when "이 섹션 적용" is clicked) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400">
                      SECTION {sectionNum}
                      {isApplied && (
                        <span className="ml-2 text-[10px] font-bold text-[#2463E9]">· 적용됨</span>
                      )}
                    </span>
                    <h4 className="font-bold text-slate-800">{label}</h4>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500 whitespace-pre-wrap">
                    {displayContent || "—"}
                  </p>
                </div>

                {/* Optimized card */}
                <div className="bg-white p-6 rounded-2xl border-2 border-[#2463E9]/20 shadow-xl shadow-blue-50/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#2463E9] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    AI REWRITTEN
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#2463E9]">OPTIMIZED</span>
                    <h4 className="font-bold text-slate-800">{label}</h4>
                  </div>
                  {afterContent ? (
                    <OptimizedWithHighlights before={beforeContent} after={afterContent} />
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-500">—</p>
                  )}
                  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end gap-3 flex-wrap">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-lg text-xs font-bold bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      onClick={() => copySectionOptimized(key, afterContent)}
                    >
                      {copiedSection === key ? (
                        <Check className="w-3.5 h-3.5 mr-1.5 text-[#2463E9]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      부분 복사
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={loading || !afterContent}
                      className="rounded-lg text-xs font-bold bg-[#2463E9] hover:bg-[#1d4fd7] text-white"
                      onClick={() => applySection(key, afterContent)}
                    >
                      {copiedSection === key ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5" />
                          적용됨
                        </>
                      ) : (
                        "이 섹션 적용"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Sticky sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          {/* Target job card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                {targetJob?.logoUrl ? (
                  <img
                    src={targetJob.logoUrl}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-slate-600">
                    {targetJob?.company?.charAt(0) ?? "?"}
                  </span>
                )}
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#2463E9] text-[10px] font-bold rounded mb-1">
                  분석 대상 공고
                </span>
                <h5 className="text-sm font-bold text-slate-900">
                  {targetJob?.company ?? "선택한 채용"}
                </h5>
              </div>
            </div>
            <h4 className="text-base font-bold mb-4 leading-snug text-slate-900">
              {targetJob?.title ?? `채용 #${targetJobId}`}
            </h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">매칭률</span>
                <span className="font-bold text-[#2463E9]">
                  {targetJob?.match ?? 0}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2463E9] transition-all duration-300"
                  style={{ width: `${targetJob?.match ?? 0}%` }}
                />
              </div>
            </div>
            <Button asChild variant="outline" className="w-full rounded-xl border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">
              <Link href={`/jobs/${targetJobId}`}>
                채용 상세 요강 보기
                <FileText className="w-3 h-3 ml-1 inline" />
              </Link>
            </Button>
          </div>

          {/* Optimization settings (dark card) */}
          <div className="bg-[#1A1A1A] p-8 rounded-[32px] text-white">
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2463E9]" />
              최적화 설정
            </h4>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  대상 채용 · 언어
                </label>
                <div className="space-y-3">
                  <Select value={targetJobId} onValueChange={setTargetJobId}>
                    <SelectTrigger className="w-full bg-white/5 border-0 rounded-xl text-sm text-white h-auto py-3">
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
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full bg-white/5 border-0 rounded-xl text-sm text-white h-auto py-3">
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
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  최적화 강도
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIntensity("natural")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      intensity === "natural"
                        ? "bg-[#2463E9] text-white shadow-lg shadow-blue-900/20"
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    자연스럽게
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntensity("keyword")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      intensity === "keyword"
                        ? "bg-[#2463E9] text-white shadow-lg shadow-blue-900/20"
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    키워드 중심
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <div className="h-px bg-gray-800 mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-400">남은 AI 크레딧</span>
                  <span className="text-xs font-bold">
                    {usageCount} / {usageLimit}
                  </span>
                </div>
                <Button
                  type="button"
                  disabled={loading}
                  className="w-full py-4 bg-[#2463E9] hover:bg-[#1d4fd7] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20"
                  onClick={runFullOptimize}
                >
                  전체 최적화 다시 실행
                </Button>
              </div>
            </div>
          </div>

          {/* AI strategy explanation */}
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
            <h4 className="text-sm font-bold text-[#2463E9] mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              AI가 제안하는 전략
            </h4>
            <ul className="space-y-4">
              {OPTIMIZATION_RATIONALE.map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#2463E9] mt-1 shrink-0">✓</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{line}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Usage note */}
          <p className="text-xs text-slate-400">
            이번 달 사용: {usageCount}/{usageLimit} (무료) · 프리미엄으로 무제한 이용
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PrepareResumePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] mx-auto h-64 animate-pulse rounded-2xl bg-slate-100" />
      }
    >
      <PrepareResumeContent />
    </Suspense>
  );
}
