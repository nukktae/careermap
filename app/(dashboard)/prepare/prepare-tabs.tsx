"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Building2, ChevronRight } from "lucide-react";
import { getJobById } from "@/lib/data/jobs";
import { LINKAREER_ID_OFFSET } from "@/lib/data/linkareer";

const prepareTabs = [
  { href: "/prepare/skills", label: "스킬 갭" },
  { href: "/prepare/resume", label: "이력서 최적화" },
  { href: "/prepare/preview", label: "이력서 미리보기" },
  { href: "/prepare/cover-letter", label: "자소서" },
  { href: "/prepare/interview", label: "면접 준비" },
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

export function PrepareTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const jobParam = searchParams.get("job");
  const jobId = jobParam != null ? parseInt(jobParam, 10) : null;
  const validJobId = jobId != null && !Number.isNaN(jobId) ? jobId : null;
  const query = validJobId != null ? `?job=${validJobId}` : "";
  const showTabs = pathname !== "/prepare" && pathname.startsWith("/prepare/");
  const jobLabel = useSelectedJobLabel(validJobId);

  if (!showTabs) return null;

  return (
    <div className="space-y-3">
      {validJobId != null && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/10">
              <Building2 className="h-4 w-4 text-primary-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground-muted">
                이 채용 준비 중
              </p>
              <p className="font-semibold text-foreground truncate">
                {jobLabel === "loading"
                  ? "불러오는 중…"
                  : jobLabel
                    ? `${jobLabel.company} · ${jobLabel.title}`
                    : "채용 정보"}
              </p>
            </div>
            <Link
              href={`/jobs/${validJobId}`}
              className="shrink-0 inline-flex items-center gap-0.5 text-sm font-medium text-primary hover:underline"
            >
              채용 상세
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-background-secondary border border-border w-full overflow-x-auto">
        {prepareTabs.map((tab) => {
          const hrefWithJob = tab.href + query;
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "?");
          return (
            <Link
              key={tab.href}
              href={hrefWithJob}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-foreground-secondary hover:text-foreground hover:bg-background-tertiary"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
