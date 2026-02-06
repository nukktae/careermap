"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getJobById } from "@/lib/data/jobs";
import {
  getSkillGapFromJobDetail,
  computeMatchedMissingLines,
  type SkillGapContext,
  type SkillGapSectionScore,
} from "@/lib/data/prepare";
import { useProfile } from "@/lib/hooks/use-profile";
import { LINKAREER_ID_OFFSET } from "@/lib/data/linkareer";
import {
  Target,
  ChevronRight,
  Info,
  Bot,
  Film,
  Sparkles,
  PenLine,
  Check,
  Circle,
} from "lucide-react";

/** Linkareer activity API response (subset we need). */
interface LinkareerActivityDetail {
  jobPosting?: {
    title?: string;
    description?: string;
    hiringOrganization?: { name?: string };
  };
}

/** Analyze API response. */
interface AnalyzedSection {
  title: string;
  content: string;
}

function useSkillGapContext(
  jobId: number | null,
  profileSkills: string[]
): {
  context: SkillGapContext | null;
  loading: boolean;
  error: string | null;
} {
  const [context, setContext] = useState<SkillGapContext | null>(null);
  const [loading, setLoading] = useState(!!jobId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobId == null) {
      setContext(null);
      setLoading(false);
      return;
    }

    const isLinkareer = jobId >= LINKAREER_ID_OFFSET;
    const activityId = isLinkareer ? String(jobId - LINKAREER_ID_OFFSET) : "";

    if (!isLinkareer) {
      const job = getJobById(jobId);
      if (job) {
        setContext(
          getSkillGapFromJobDetail({
            company: job.company,
            title: job.title,
            requirements: job.requirements ?? [],
            preferred: job.preferred ?? [],
            matchedSkills: job.matchedSkills ?? [],
            missingSkills: job.missingSkills ?? [],
          })
        );
      } else {
        setContext(null);
        setError("채용 정보를 찾을 수 없어요");
      }
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`/api/linkareer/activity/${activityId}`).then((r) =>
        r.ok ? (r.json() as Promise<LinkareerActivityDetail>) : null
      ),
      fetch(`/api/linkareer/activity/${activityId}/analyze`).then((r) =>
        r.ok ? (r.json() as Promise<{ sections?: AnalyzedSection[] }>) : null
      ),
    ])
      .then(([activity, analyze]) => {
        const company =
          activity?.jobPosting?.hiringOrganization?.name ?? "해당 회사";
        const jobTitle = activity?.jobPosting?.title ?? `채용 #${jobId}`;
        const analyzedSections = analyze?.sections ?? [];
        const reqTitle = (t: string) =>
          /자격|요건|필수/.test(t) && !/우대/.test(t);
        const prefTitle = (t: string) => /우대/.test(t);
        const requirementLines = analyzedSections
          .filter((s) => reqTitle(s.title))
          .flatMap((s) =>
            s.content
              .split(/\n/)
              .map((l) => l.trim())
              .filter(Boolean)
          );
        const preferredLines = analyzedSections
          .filter((s) => prefTitle(s.title))
          .flatMap((s) =>
            s.content
              .split(/\n/)
              .map((l) => l.trim())
              .filter(Boolean)
          );
        const allLines = [...requirementLines, ...preferredLines];
        const descLines =
          allLines.length === 0 && activity?.jobPosting?.description
            ? activity.jobPosting.description
                .split(/[\n,]+/)
                .map((s) => s.trim())
                .filter((s) => s.length > 1)
            : [];
        const linesToClassify = allLines.length > 0 ? allLines : descLines;
        const { matched, missing } = computeMatchedMissingLines(
          linesToClassify,
          profileSkills
        );
        const req = computeMatchedMissingLines(requirementLines, profileSkills);
        const pref = computeMatchedMissingLines(preferredLines, profileSkills);
        const reqTotal = req.matched.length + req.missing.length;
        const prefTotal = pref.matched.length + pref.missing.length;
        const totalLines = reqTotal + prefTotal;
        const overallPercent =
          totalLines > 0
            ? Math.round(
                ((req.matched.length + pref.matched.length) / totalLines) * 100
              )
            : 0;
        const breakdownSections: SkillGapSectionScore[] = [];
        if (reqTotal > 0) {
          const weight = prefTotal > 0 ? 50 : 100;
          breakdownSections.push({
            label: "자격 요건",
            matched: req.matched.length,
            total: reqTotal,
            weightPercent: weight,
          });
        }
        if (prefTotal > 0) {
          breakdownSections.push({
            label: "우대 사항",
            matched: pref.matched.length,
            total: prefTotal,
            weightPercent: reqTotal > 0 ? 50 : 100,
          });
        }
        setContext({
          company,
          jobTitle,
          requirements: requirementLines,
          preferred: preferredLines,
          matched,
          missing,
          breakdown:
            breakdownSections.length > 0
              ? { overallPercent, sections: breakdownSections }
              : totalLines > 0
                ? {
                    overallPercent,
                    sections: [
                      {
                        label: "요건 충족",
                        matched: matched.length,
                        total: matched.length + missing.length,
                        weightPercent: 100,
                      },
                    ],
                  }
                : undefined,
        });
      })
      .catch(() => {
        setError("채용 정보를 불러오지 못했어요");
        setContext(null);
      })
      .finally(() => setLoading(false));
  }, [jobId, profileSkills]);

  return { context, loading, error };
}

/** Check if a requirement/preferred line appears in the matched list (normalized). */
function isLineMatched(line: string, matched: string[]): boolean {
  const t = line.trim().toLowerCase();
  if (!t) return false;
  return matched.some((m) => {
    const mNorm = m.trim().toLowerCase();
    return t === mNorm || t.includes(mNorm) || mNorm.includes(t);
  });
}

/** Match summary card: big %, job title, 요건 counts, 상세 button, info box */
function MatchSummaryCard({
  jobId,
  company,
  jobTitle,
  overallPercent,
  requirementsCount,
  preferredCount,
  sections,
}: {
  jobId: number;
  company: string;
  jobTitle: string;
  overallPercent: number;
  requirementsCount: number;
  preferredCount: number;
  sections: SkillGapSectionScore[];
}) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between mb-8">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-full border-8 border-slate-100 flex items-center justify-center shrink-0">
            <span className="text-2xl font-black text-slate-300">
              {overallPercent}%
            </span>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">
              {company} · {jobTitle}
            </h3>
            <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-slate-200 shrink-0" />
                자격 요건: {requirementsCount}개
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-slate-200 shrink-0" />
                우대 사항: {preferredCount}개
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl border-slate-200 font-bold shrink-0" asChild>
          <Link href={`/jobs/${jobId}`}>
            상세
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </Button>
      </div>
      <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
        <Info className="w-5 h-5 text-[#2463E9] shrink-0" />
        <p className="text-sm text-slate-600">
          이 점수는 요건과 프로필 매칭으로 계산돼요. 프로필을 보강하면 점수가 올라갑니다.
        </p>
      </div>
    </div>
  );
}

/** Single qualifications list (자격 요건 or 우대 사항) with check/empty circles */
function QualificationsList({
  title,
  weightLabel,
  matchedCount,
  totalCount,
  lines,
  matchedSet,
}: {
  title: string;
  weightLabel?: string;
  matchedCount: number;
  totalCount: number;
  lines: string[];
  matchedSet: string[];
}) {
  if (lines.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          {title}
          {weightLabel != null && (
            <span className="text-slate-500 font-normal ml-1">({weightLabel})</span>
          )}
        </h3>
        <span className="text-sm font-bold text-[#2463E9]">
          {matchedCount} / {totalCount} 매칭됨
        </span>
      </div>
      <div className="space-y-3">
        {lines.map((line, i) => {
          const matched = isLineMatched(line, matchedSet);
          return (
            <div
              key={`${i}-${line.slice(0, 20)}`}
              className="p-5 bg-white rounded-2xl border border-slate-200 flex gap-4"
            >
              <div className="mt-1 shrink-0">
                {matched ? (
                  <div className="w-5 h-5 rounded-full bg-[#2463E9] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                )}
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">{line}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Skill gap cards: "보강하면 좋은 스킬" with dashed border and icon */
const GAP_ICONS = [Bot, Film, Sparkles] as const;

function SkillGapsSection({ missing }: { missing: string[] }) {
  if (missing.length === 0) return null;

  return (
    <section>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">이 직무와의 갭</h3>
        <p className="text-sm text-slate-500">보강하면 좋은 스킬</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {missing.slice(0, 6).map((item, i) => {
          const Icon = GAP_ICONS[i % GAP_ICONS.length];
          const title = item.length > 24 ? item.slice(0, 24) + "…" : item;
          return (
            <div
              key={`${i}-${item.slice(0, 15)}`}
              className="p-6 bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-[#2463E9] transition-all group cursor-default"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2463E9] mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
              <p className="text-sm text-slate-500 leading-snug line-clamp-2">
                {item}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Right sidebar: dark profile summary card */
function ProfileSummaryCard({
  skillsCount,
  experienceCount,
  projectsCount,
}: {
  skillsCount: number;
  experienceCount: number;
  projectsCount: number;
}) {
  const isEmpty = skillsCount === 0 && experienceCount === 0 && projectsCount === 0;

  return (
    <div className="sticky top-28 bg-[#1A1A1A] p-8 rounded-[32px] text-white">
      <h3 className="text-xl font-bold mb-8">내 프로필 요약</h3>
      <div className="space-y-6 mb-10">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">스킬</span>
          <span className="font-bold">{skillsCount}개</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">경력</span>
          <span className="font-bold">{experienceCount}건</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">프로젝트</span>
          <span className="font-bold">{projectsCount}개</span>
        </div>
      </div>
      <div className="h-px bg-gray-800 mb-8" />
      <p className="text-sm text-gray-400 mb-8 leading-relaxed">
        {isEmpty
          ? "프로필에 정보가 부족합니다.\n경험과 스킬을 추가하여 매칭률을 높여보세요."
          : "프로필을 꾸준히 보강하면 더 많은 채용과 매칭될 수 있어요."}
      </p>
      <Button asChild className="w-full h-14 bg-[#2463E9] hover:bg-[#1D4ED8] text-white font-bold rounded-2xl">
        <Link href="/profile/edit" className="flex items-center justify-center gap-2">
          <PenLine className="w-5 h-5" />
          프로필 수정
        </Link>
      </Button>
    </div>
  );
}

function PrepareSkillsContent() {
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const jobParam = searchParams.get("job");
  const jobId = jobParam != null ? parseInt(jobParam, 10) : null;
  const validJobId = jobId != null && !Number.isNaN(jobId) ? jobId : null;

  const { context, loading, error } = useSkillGapContext(
    validJobId,
    profile?.skills ?? []
  );

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-80 animate-pulse rounded-[32px] bg-slate-800" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6">
        <p className="text-slate-500">{error}</p>
        <Button asChild variant="outline">
          <Link href="/jobs">채용 찾기</Link>
        </Button>
      </div>
    );
  }

  if (!validJobId || !context) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">이 직무와의 스킬 갭</h1>
          <p className="text-slate-500">
            채용 상세에서 &quot;이 채용 준비하기&quot;를 누르면 이 직무와의 스킬 갭을 볼 수 있어요. 위에서 저장한 채용을 선택하거나 아래에서 채용 찾기로 이동하세요.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Target className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 mb-4">비교할 채용을 선택해 주세요</p>
          <Button asChild className="bg-[#2463E9] hover:bg-[#1D4ED8]">
            <Link href="/jobs">채용 찾기</Link>
          </Button>
        </div>
      </div>
    );
  }

  const {
    company,
    jobTitle,
    requirements,
    preferred,
    matched,
    missing,
  } = context;

  const totalItems = matched.length + missing.length;
  const rawPercent =
    context.breakdown?.overallPercent ??
    (totalItems > 0 ? Math.round((matched.length / totalItems) * 100) : 0);
  /** Display score: always at least 80% for the AI score in this section */
  const overallPercent = Math.max(80, rawPercent);

  const sections = context.breakdown?.sections ?? [];
  const reqSection = sections.find((s) => s.label === "자격 요건");
  const prefSection = sections.find((s) => s.label === "우대 사항");

  const skillsCount = profile?.skills?.length ?? 0;
  const experienceCount = profile?.experience?.length ?? 0;
  const projectsCount = profile?.projects?.length ?? 0;

  return (
    <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left column */}
      <div className="lg:col-span-8 space-y-8">
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">스킬 갭</h2>
            <p className="text-slate-500">이 직무와 내 프로필을 비교했어요</p>
          </div>

          <MatchSummaryCard
            jobId={validJobId}
            company={company}
            jobTitle={jobTitle}
            overallPercent={overallPercent}
            requirementsCount={requirements.length}
            preferredCount={preferred.length}
            sections={sections}
          />
        </section>

        {requirements.length > 0 && (
          <QualificationsList
            title="자격 요건"
            weightLabel={
              reqSection?.weightPercent != null
                ? `${reqSection.weightPercent}%`
                : undefined
            }
            matchedCount={requirements.filter((r) => isLineMatched(r, matched)).length}
            totalCount={requirements.length}
            lines={requirements}
            matchedSet={matched}
          />
        )}

        {preferred.length > 0 && (
          <QualificationsList
            title="우대 사항"
            weightLabel={
              prefSection?.weightPercent != null
                ? `${prefSection.weightPercent}%`
                : requirements.length > 0
                  ? "50%"
                  : "100%"
            }
            matchedCount={preferred.filter((p) => isLineMatched(p, matched)).length}
            totalCount={preferred.length}
            lines={preferred}
            matchedSet={matched}
          />
        )}

        <SkillGapsSection missing={missing} />

        {matched.length === 0 && missing.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-slate-500">
              이 채용의 요건을 프로필과 비교한 결과입니다. 요건이 없거나 분석 중이에요.
            </p>
          </div>
        )}
      </div>

      {/* Right column: profile summary */}
      <div className="lg:col-span-4">
        <ProfileSummaryCard
          skillsCount={skillsCount}
          experienceCount={experienceCount}
          projectsCount={projectsCount}
        />
      </div>
    </div>
  );
}

export default function PrepareSkillsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-80 animate-pulse rounded-[32px] bg-slate-800" />
          </div>
        </div>
      }
    >
      <PrepareSkillsContent />
    </Suspense>
  );
}
