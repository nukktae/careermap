"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Building2, ChevronRight } from "lucide-react";
import { getJobById } from "@/lib/data/jobs";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import { LINKAREER_ID_OFFSET } from "@/lib/data/linkareer";

const prepareTabs = [
  { href: "/prepare/skills", label: "스킬 갭 분석" },
  { href: "/prepare/resume", label: "이력서 최적화" },
  { href: "/prepare/preview", label: "이력서 미리보기" },
  { href: "/prepare/cover-letter", label: "자기소개서 생성" },
  { href: "/prepare/interview", label: "AI 면접 대비" },
];

interface JobLabel {
  company: string;
  title: string;
}

function useSelectedJobLabel(jobId: number | null): JobLabel | null | "loading" {
  const [linkareerLabel, setLinkareerLabel] = useState<JobLabel | null>(null);
  const [loading, setLoading] = useState(false);
  const isLinkareer = jobId != null && !Number.isNaN(jobId) && jobId >= LINKAREER_ID_OFFSET;
  const activityId = jobId != null && isLinkareer ? String(jobId - LINKAREER_ID_OFFSET) : "";

  useEffect(() => {
    if (!isLinkareer || !activityId) return;
    let cancelled = false;
    setLoading(true);
    setLinkareerLabel(null);
    fetch(`/api/linkareer/activity/${activityId}`)
      .then((r) => (r.ok ? (r.json() as Promise<{ jobPosting?: { title?: string; hiringOrganization?: { name?: string } } }>) : null))
      .then((data) => {
        if (cancelled) return;
        const company = data?.jobPosting?.hiringOrganization?.name ?? "해당 회사";
        const title = data?.jobPosting?.title ?? `채용 #${jobId}`;
        setLinkareerLabel({ company, title });
      })
      .catch(() => {
        if (!cancelled) setLinkareerLabel({ company: "Linkareer", title: `채용 #${activityId}` });
      })
      .finally(() => setLoading(false));
    return () => { cancelled = true; };
  }, [activityId, isLinkareer, jobId]);

  if (jobId == null || Number.isNaN(jobId)) return null;
  const localJob = !isLinkareer ? getJobById(jobId) : undefined;
  if (localJob) return { company: localJob.company, title: localJob.title };
  if (!isLinkareer) return { company: "선택한 채용", title: `채용 #${jobId}` };
  if (loading) return "loading";
  if (linkareerLabel) return linkareerLabel;
  return "loading";
}

/** Fetch company/title for saved job IDs (Linkareer only; local jobs use getJobById). */
function useSavedJobLabels(jobIds: number[]): Record<number, JobLabel | "loading"> {
  const [labels, setLabels] = useState<Record<number, JobLabel>>({});

  useEffect(() => {
    const linkareerIds = jobIds.filter(
      (id) => !Number.isNaN(id) && id >= LINKAREER_ID_OFFSET
    );
    if (linkareerIds.length === 0) {
      setLabels({});
      return;
    }
    let cancelled = false;
    const activityIds = linkareerIds.map((id) => ({
      jobId: id,
      activityId: String(id - LINKAREER_ID_OFFSET),
    }));
    Promise.all(
      activityIds.map(({ jobId, activityId }) =>
        fetch(`/api/linkareer/activity/${activityId}`)
          .then((r) =>
            r.ok
              ? (r.json() as Promise<{
                  jobPosting?: {
                    title?: string;
                    hiringOrganization?: { name?: string };
                  };
                }>)
              : null
          )
          .then((data) => {
            if (cancelled) return { jobId, company: "", title: "" };
            const company =
              data?.jobPosting?.hiringOrganization?.name ?? "해당 회사";
            const title = data?.jobPosting?.title ?? `채용 #${jobId}`;
            return { jobId, company, title };
          })
          .catch(() => ({
            jobId,
            company: "Linkareer",
            title: `채용 #${activityId}`,
          }))
      )
    ).then((results) => {
      if (cancelled) return;
      const next: Record<number, JobLabel> = {};
      results.forEach((r) => {
        next[r.jobId] = { company: r.company, title: r.title };
      });
      setLabels(next);
    });
    return () => {
      cancelled = true;
    };
  }, [jobIds.join(",")]);

  const result: Record<number, JobLabel | "loading"> = {};
  jobIds.forEach((id) => {
    const local = getJobById(id);
    if (local) {
      result[id] = { company: local.company, title: local.title };
    } else if (id >= LINKAREER_ID_OFFSET) {
      result[id] = labels[id] ?? "loading";
    } else {
      result[id] = { company: "선택한 채용", title: `채용 #${id}` };
    }
  });
  return result;
}

export function PrepareTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { savedWithDates } = useSavedJobs();
  const jobParam = searchParams.get("job");
  const jobId = jobParam != null ? parseInt(jobParam, 10) : null;
  const validJobId = jobId != null && !Number.isNaN(jobId) ? jobId : null;
  const query = validJobId != null ? `?job=${validJobId}` : "";
  const showTabs = pathname !== "/prepare" && pathname.startsWith("/prepare/");
  const jobLabel = useSelectedJobLabel(validJobId);
  const savedJobIds = savedWithDates.map((e) => e.jobId);
  const savedLabels = useSavedJobLabels(savedJobIds);

  if (!showTabs) return null;

  const activeTab = prepareTabs.find(
    (t) => pathname === t.href || pathname.startsWith(t.href + "?")
  );
  const breadcrumbLabel = activeTab?.label ?? "커리어 준비";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link href="/prepare" className="hover:text-slate-600 transition-colors">
          커리어 준비
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
        <span className="text-slate-900 font-medium">{breadcrumbLabel}</span>
      </nav>

      {validJobId == null && savedJobIds.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">저장한 채용에서 선택</p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {savedJobIds.map((id) => {
              const labelData = savedLabels[id];
              const label =
                labelData === "loading"
                  ? "불러오는 중…"
                  : labelData
                    ? `${labelData.company} · ${labelData.title}`
                    : `채용 #${id}`;
              return (
                <Link
                  key={id}
                  href={`${pathname}?job=${id}`}
                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-[#2463E9]/30 hover:bg-blue-50/50 transition-colors min-w-[200px] max-w-[280px]"
                >
                  <p className="font-medium text-slate-900 truncate text-sm">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">이 채용으로 준비하기 →</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {validJobId != null && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Building2 className="h-5 w-5 text-[#2463E9]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500">이 채용 준비 중</p>
              <p className="font-semibold text-slate-900 truncate">
                {jobLabel === "loading"
                  ? "불러오는 중…"
                  : jobLabel
                    ? `${jobLabel.company} · ${jobLabel.title}`
                    : "채용 정보"}
              </p>
            </div>
            <Link
              href={`/jobs/${validJobId}`}
              className="shrink-0 inline-flex items-center gap-0.5 text-sm font-semibold text-[#2463E9] hover:underline"
            >
              채용 상세
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab bar: underline active style */}
      <nav
        className="flex gap-8 md:gap-10 border-b border-slate-200 -mb-px overflow-x-auto pb-px"
        aria-label="준비 탭"
      >
        {prepareTabs.map((tab) => {
          const hrefWithJob = tab.href + query;
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "?");
          return (
            <Link
              key={tab.href}
              href={hrefWithJob}
              className={`pb-4 text-base font-medium whitespace-nowrap transition-colors border-b-2 mt-px ${
                isActive
                  ? "text-[#2463E9] border-[#2463E9] font-bold"
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
