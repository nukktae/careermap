"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { getJobs, filterJobs, DEFAULT_JOB_FILTERS, type JobFiltersState } from "@/lib/data/jobs";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import { JobCard } from "@/components/jobs/job-card";
import { JobFiltersModal } from "@/components/jobs/job-filters-modal";

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
  const { isSaved, toggleSaved } = useSavedJobs();

  const searchFiltered = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredJobs = filterJobs(searchFiltered, filters);
  const activeFilterCount = countActiveFilters(filters);

  const handleToggleSave = (jobId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(jobId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">채용 찾기</h1>
        <p className="text-foreground-secondary">
          내 프로필에 맞는 {jobs.length}개의 채용이 있어요
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
          <Input
            type="text"
            placeholder="직무, 회사 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <Button
          variant="outline"
          className="h-11"
          onClick={() => setFiltersModalOpen(true)}
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          필터
          {activeFilterCount > 0 && (
            <span className="ml-2 w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      <JobFiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        filters={filters}
        onFiltersChange={setFilters}
        jobs={searchFiltered}
        onApply={() => {}}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-secondary">
          {filteredJobs.length}개의 채용
        </p>
        <select className="text-sm bg-transparent border border-border rounded-lg px-3 py-1.5 text-foreground">
          <option>매칭 점수순</option>
          <option>최신순</option>
          <option>연봉순</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSaved={isSaved(job.id)}
            onToggleSave={handleToggleSave}
            href={`/jobs/${job.id}`}
          />
        ))}
      </div>

      {filteredJobs.length === 0 && (
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
