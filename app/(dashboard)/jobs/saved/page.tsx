"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { getJobById } from "@/lib/data/jobs";
import type { Job } from "@/lib/data/jobs";
import { mapLinkareerNodeToJob, type LinkareerResponse } from "@/lib/data/linkareer";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import { JobCard } from "@/components/jobs/job-card";

type SortOption = "savedAt" | "match";

function resolveJob(jobId: number, linkareerJobs: Job[]): Job | undefined {
  const fromStatic = getJobById(jobId);
  if (fromStatic) return fromStatic;
  return linkareerJobs.find((j) => j.id === jobId);
}

export default function SavedJobsPage() {
  const { savedWithDates, isSaved, toggleSaved } = useSavedJobs();
  const [sortBy, setSortBy] = useState<SortOption>("savedAt");
  const [linkareerJobs, setLinkareerJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch("/data/linkareer-recruits.json")
      .then((res) => res.json())
      .then((data: LinkareerResponse) => {
        const nodes = data.data?.activities?.nodes ?? [];
        setLinkareerJobs(nodes.map(mapLinkareerNodeToJob));
      })
      .catch(() => setLinkareerJobs([]));
  }, []);

  const savedJobs = useMemo(() => {
    const entries = savedWithDates
      .map((e) => ({ entry: e, job: resolveJob(e.jobId, linkareerJobs) }))
      .filter((x): x is { entry: { jobId: number; savedAt: number }; job: Job } => x.job != null);

    if (sortBy === "savedAt") {
      entries.sort((a, b) => b.entry.savedAt - a.entry.savedAt);
    } else {
      entries.sort((a, b) => b.job.match - a.job.match);
    }
    return entries;
  }, [savedWithDates, sortBy, linkareerJobs]);

  const handleToggleSave = (jobId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(jobId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          저장한 채용
        </h1>
        <p className="text-foreground-secondary">
          {savedJobs.length}개의 저장한 채용
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 rounded-full bg-background-secondary flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-foreground-muted" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            저장한 채용이 없어요
          </h3>
          <p className="text-foreground-secondary mb-6 max-w-sm mx-auto">
            관심있는 채용을 저장해보세요
          </p>
          <Button asChild>
            <Link href="/jobs">채용 찾기</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground-secondary">
              {savedJobs.length}개의 채용
            </p>
            <select
              className="text-sm bg-transparent border border-border rounded-lg px-3 py-1.5 text-foreground"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="savedAt">저장일순</option>
              <option value="match">매칭 점수순</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedJobs.map(({ job }) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={isSaved(job.id)}
                onToggleSave={handleToggleSave}
                href={`/jobs/${job.id}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
