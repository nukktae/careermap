"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/app-icon";
import { getJobById } from "@/lib/data/jobs";
import { useProfile } from "@/lib/hooks/use-profile";
import {
  getSkillGapFromJobDetail,
  computeMatchedMissingLines,
  type SkillGapContext,
  type SkillGapSectionScore,
} from "@/lib/data/prepare";
import { LINKAREER_ID_OFFSET } from "@/lib/data/linkareer";
import { User, Check, Target, ChevronRight } from "lucide-react";

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

function PrepareSkillsContent() {
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const jobParam = searchParams.get("job");
  const jobId =
    jobParam != null ? parseInt(jobParam, 10) : null;
  const validJobId =
    jobId != null && !Number.isNaN(jobId) ? jobId : null;

  const { context, loading, error } = useSkillGapContext(
    validJobId,
    profile?.skills ?? []
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-background-secondary" />
        <div className="h-48 animate-pulse rounded-xl bg-background-secondary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <p className="text-foreground-muted">{error}</p>
        <Button asChild variant="outline">
          <Link href="/jobs">채용 찾기</Link>
        </Button>
      </div>
    );
  }

  if (!validJobId || !context) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            이 직무와의 스킬 갭
          </h1>
          <p className="text-foreground-secondary">
            채용 상세에서 &quot;이 채용 준비하기&quot;를 누르면 이 직무와의 스킬 갭을 볼 수 있어요. 위에서 저장한 채용을 선택하거나 아래에서 채용 찾기로 이동하세요.
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

  const { company, jobTitle, requirements, preferred, matched, missing } = context;
  const hasGap = matched.length > 0 || missing.length > 0;
  const totalItems = matched.length + missing.length;
  const overallPercent =
    context.breakdown?.overallPercent ??
    (totalItems > 0 ? Math.round((matched.length / totalItems) * 100) : 0);
  const sections = context.breakdown?.sections ?? (totalItems > 0
    ? [
        {
          label: "요건 충족",
          matched: matched.length,
          total: totalItems,
          weightPercent: 100,
        },
      ]
    : []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          이 직무와의 스킬 갭
        </h1>
        <p className="text-foreground-secondary">
          이 직무와 내 프로필을 비교했어요
        </p>
      </div>

      {/* Job context card with match % and section bars (like match modal) */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-4 p-4 border-b border-border">
          <div className="min-w-0 flex-1 flex items-center gap-4">
            {(overallPercent > 0 || totalItems > 0) && (
              <div className="relative w-14 h-14 shrink-0">
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
                    strokeDasharray={`${overallPercent * 1.51} 151`}
                    strokeLinecap="round"
                    className={
                      overallPercent >= 70
                        ? "text-success-500"
                        : overallPercent >= 40
                          ? "text-warning-500"
                          : "text-error-500"
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-foreground">
                    {overallPercent}%
                  </span>
                </div>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">
                {company} · {jobTitle}
              </p>
              <p className="text-sm text-foreground-muted">
                자격 요건 {requirements.length}개 · 우대 {preferred.length}개
                {sections.length > 0 && " · 이 점수는 요건과 프로필 매칭으로 계산돼요"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/jobs/${validJobId}`}>
              상세 <ChevronRight className="h-4 w-4 ml-0.5" />
            </Link>
          </Button>
        </div>

        {/* Section progress bars (like match modal) */}
        {sections.length > 0 && (
          <div className="px-4 pb-4 space-y-4">
            {sections.map((sec) => (
              <div key={sec.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {sec.label}
                    {sec.weightPercent != null && (
                      <span className="text-foreground-muted font-normal">
                        {" "}({sec.weightPercent}%)
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {sec.matched}/{sec.total}
                  </span>
                </div>
                <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{
                      width: `${sec.total > 0 ? (sec.matched / sec.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {(requirements.length > 0 || preferred.length > 0) && (
          <ul className="px-4 pb-4 space-y-2 text-sm text-foreground-secondary">
            {requirements.slice(0, 5).map((r, i) => (
              <li key={`req-${i}`} className="flex gap-2">
                <span className="text-foreground-muted shrink-0">·</span>
                <span>{r}</span>
              </li>
            ))}
            {requirements.length > 5 && (
              <li className="text-foreground-muted">
                외 {requirements.length - 5}개
              </li>
            )}
            {requirements.length === 0 && preferred.slice(0, 3).map((p, i) => (
              <li key={`pref-${i}`} className="flex gap-2">
                <span className="text-foreground-muted shrink-0">·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Profile summary */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background-secondary px-3 py-1.5 text-sm text-foreground">
          <User className="h-4 w-4 text-foreground-muted" />
          스킬 {profile.skills?.length ?? 0}개 · 경력 {profile.experience?.length ?? 0}건 · 프로젝트 {profile.projects?.length ?? 0}개
        </span>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile/edit">프로필 수정</Link>
        </Button>
      </div>

      {/* Gap: matched vs missing */}
      {hasGap && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-foreground">
            이 직무와의 갭
          </h2>
          {matched.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground-muted mb-2">
                보유 스킬
              </p>
              <div className="flex flex-wrap gap-2">
                {matched.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-sm text-foreground"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {missing.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground-muted mb-2">
                보강하면 좋은 스킬
              </p>
              <div className="flex flex-wrap gap-2">
                {missing.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-sm text-foreground"
                  >
                    <Target className="h-3.5 w-3.5" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!hasGap && (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-foreground-secondary">
            이 채용의 요건을 프로필과 비교한 결과입니다. 요건이 없거나 분석 중이에요.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PrepareSkillsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-background-secondary" />
          <div className="h-48 animate-pulse rounded-xl bg-background-secondary" />
        </div>
      }
    >
      <PrepareSkillsContent />
    </Suspense>
  );
}
