"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  JobFiltersState,
  DEFAULT_JOB_FILTERS,
  filterJobs,
  type JobDetail,
  type JobTypeValue,
  type CompanyTypeValue,
  type LocationFilterValue,
  type ExperienceLevelValue,
  type IndustryValue,
} from "@/lib/data/jobs";

const MATCH_LEVEL_OPTIONS: { value: "all" | "apply" | "prep" | "stretch"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "apply", label: "지원 가능 (85%+)" },
  { value: "prep", label: "준비 필요 (60-84%)" },
  { value: "stretch", label: "도전 목표 (<60%)" },
];

const JOB_TYPE_OPTIONS: { value: JobTypeValue; label: string }[] = [
  { value: "fulltime", label: "정규직" },
  { value: "intern", label: "인턴" },
  { value: "contract", label: "계약직" },
];

const COMPANY_TYPE_OPTIONS: { value: CompanyTypeValue; label: string }[] = [
  { value: "대기업", label: "대기업" },
  { value: "공기업", label: "공기업" },
  { value: "스타트업", label: "스타트업" },
  { value: "외국계", label: "외국계" },
];

const LOCATION_OPTIONS: { value: LocationFilterValue; label: string }[] = [
  { value: "seoul", label: "서울" },
  { value: "gyeonggi", label: "경기" },
  { value: "busan", label: "부산" },
  { value: "remote", label: "원격" },
];

const EXPERIENCE_OPTIONS: { value: ExperienceLevelValue; label: string }[] = [
  { value: "신입", label: "신입" },
  { value: "경력 1-3년", label: "경력 1-3년" },
  { value: "경력 3-5년", label: "경력 3-5년" },
];

const INDUSTRY_OPTIONS: { value: IndustryValue; label: string }[] = [
  { value: "IT", label: "IT" },
  { value: "Finance", label: "금융" },
  { value: "Consulting", label: "컨설팅" },
  { value: "E-commerce", label: "이커머스" },
];

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

export interface JobFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: JobFiltersState;
  onFiltersChange: (filters: JobFiltersState) => void;
  jobs: JobDetail[];
  onApply: () => void;
}

export function JobFiltersModal({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  jobs,
  onApply,
}: JobFiltersModalProps) {
  const [local, setLocal] = useState<JobFiltersState>(filters);
  const resultCount = filterJobs(jobs, local).length;

  useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  const toggleArray = <T,>(
    key: keyof JobFiltersState,
    value: T,
    arr: T[]
  ) => {
    const next = arr.includes(value)
      ? arr.filter((x) => x !== value)
      : [...arr, value];
    setLocal((prev) => ({ ...prev, [key]: next }));
  };

  const clearAll = () => {
    setLocal(DEFAULT_JOB_FILTERS);
  };

  const handleApply = () => {
    onFiltersChange(local);
    onApply();
    onOpenChange(false);
  };

  const activeCount = countActiveFilters(local);
  const hasActive = activeCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col sm:rounded-2xl border border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground pr-8">
            필터
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto -mx-1 px-1 space-y-5">
          {/* Match Level */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              매칭 수준
            </label>
            <div className="flex flex-wrap gap-2">
              {MATCH_LEVEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLocal((p) => ({ ...p, matchLevel: opt.value }))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    local.matchLevel === opt.value
                      ? "bg-primary-500 text-white"
                      : "bg-background-secondary text-foreground-secondary hover:bg-background-tertiary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Type */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              고용 형태
            </label>
            <div className="flex flex-wrap gap-3">
              {JOB_TYPE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer text-sm text-foreground-secondary"
                >
                  <Checkbox
                    checked={local.jobTypes.includes(opt.value)}
                    onCheckedChange={() =>
                      toggleArray("jobTypes", opt.value, local.jobTypes)
                    }
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Company Type */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              회사 유형
            </label>
            <div className="flex flex-wrap gap-3">
              {COMPANY_TYPE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer text-sm text-foreground-secondary"
                >
                  <Checkbox
                    checked={local.companyTypes.includes(opt.value)}
                    onCheckedChange={() =>
                      toggleArray("companyTypes", opt.value, local.companyTypes)
                    }
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              지역
            </label>
            <div className="flex flex-wrap gap-3">
              {LOCATION_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer text-sm text-foreground-secondary"
                >
                  <Checkbox
                    checked={local.locations.includes(opt.value)}
                    onCheckedChange={() =>
                      toggleArray("locations", opt.value, local.locations)
                    }
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              연봉 범위 (만원)
            </label>
            <Slider
              min={0}
              max={10000}
              step={500}
              value={local.salaryRange}
              onValueChange={(v) =>
                setLocal((p) => ({
                  ...p,
                  salaryRange: v as [number, number],
                }))
              }
              className="w-full"
            />
            <p className="text-xs text-foreground-muted mt-1">
              {local.salaryRange[0].toLocaleString()}만원 ~{" "}
              {local.salaryRange[1].toLocaleString()}만원
            </p>
          </div>

          {/* Experience Level */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              경력
            </label>
            <div className="flex flex-wrap gap-3">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer text-sm text-foreground-secondary"
                >
                  <Checkbox
                    checked={local.experienceLevels.includes(opt.value)}
                    onCheckedChange={() =>
                      toggleArray(
                        "experienceLevels",
                        opt.value,
                        local.experienceLevels
                      )
                    }
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              산업
            </label>
            <div className="flex flex-wrap gap-3">
              {INDUSTRY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer text-sm text-foreground-secondary"
                >
                  <Checkbox
                    checked={local.industries.includes(opt.value)}
                    onCheckedChange={() =>
                      toggleArray("industries", opt.value, local.industries)
                    }
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-2 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
            disabled={!hasActive}
          >
            필터 초기화
          </Button>
          <Button type="button" onClick={handleApply}>
            적용 ({resultCount}개 결과)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
