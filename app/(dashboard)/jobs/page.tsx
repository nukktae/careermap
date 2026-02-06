"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { getJobs, filterJobs, DEFAULT_JOB_FILTERS, type JobFiltersState } from "@/lib/data/jobs";
import {
  mapLinkareerNodeToJob,
  LINKAREER_ID_OFFSET,
  type LinkareerResponse,
} from "@/lib/data/linkareer";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import { JobCard } from "@/components/jobs/job-card";
import { JobFiltersModal } from "@/components/jobs/job-filters-modal";
import type { Job } from "@/lib/data/jobs";

function countActiveFilters(f: JobFiltersState): number {
  let n = 0;
  if (f.matchLevel !== "all") n++;
  if (f.jobTypes.length > 0) n++;
  if (f.companyTypes.length > 0) n++;
  if (f.locations.length > 0) n++;
  if (f.salaryRange[0] > 0 || f.salaryRange[1] < 10000) n++;
  if (f.experienceLevels.length > 0) n++;
  if (f.industries.length > 0) n++;
  return n;
}

export default function JobsPage() {
  const jobs = getJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<JobFiltersState>(DEFAULT_JOB_FILTERS);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [linkareerJobs, setLinkareerJobs] = useState<Job[]>([]);
  const { isSaved, toggleSaved } = useSavedJobs();

  useEffect(() => {
    fetch("/data/linkareer-recruits.json")
      .then((res) => res.json())
      .then((data: LinkareerResponse) => {
        const nodes = data.data?.activities?.nodes ?? [];
        setLinkareerJobs(nodes.map(mapLinkareerNodeToJob));
      })
      .catch(() => setLinkareerJobs([]));
  }, []);

  const searchFiltered = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredJobs = filterJobs(searchFiltered, filters);
  const linkareerSearchFiltered = linkareerJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayJobs = [...filteredJobs, ...linkareerSearchFiltered];
  const activeFilterCount = countActiveFilters(filters);

  function jobHref(job: Job): string {
    return `/jobs/${job.id}`;
  }

  const handleToggleSave = (jobId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(jobId);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">채용 찾기</h1>
          <p className="text-gray-500 dark:text-foreground-secondary font-medium">
            {jobs.length}개의 매칭 채용
            {linkareerJobs.length > 0 && ` + ${linkareerJobs.length}건 인턴 (Linkareer)`}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:flex-initial sm:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-foreground-muted" />
            <Input
              type="text"
              placeholder="직무, 회사 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 h-auto bg-white dark:bg-card border-gray-200 dark:border-border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          <Button
            variant="outline"
            className="px-5 py-3 h-auto font-semibold rounded-xl border-gray-200 dark:border-border flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-background-secondary"
            onClick={() => setFiltersModalOpen(true)}
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-400 dark:text-foreground-muted" />
            필터
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <JobFiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        filters={filters}
        onFiltersChange={setFilters}
        jobs={searchFiltered}
        onApply={() => {}}
      />

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-foreground-secondary font-medium">
          {displayJobs.length}개의 채용
        </p>
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-foreground"
        >
          매칭 점수순
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={isSaved(job.id)}
            onToggleSave={handleToggleSave}
            href={jobHref(job)}
          />
        ))}
      </div>

      {displayJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-background-secondary flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-foreground-muted" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            검색 결과가 없어요
          </h3>
          <p className="text-foreground-secondary mb-4">
            다른 검색어나 필터를 시도해 보세요
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setFilters(DEFAULT_JOB_FILTERS);
            }}
          >
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  );
}
