"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  MapPin,
  Building2,
  ChevronRight,
  X,
  Check,
} from "lucide-react";

// Mock job data
const jobs = [
  {
    id: 1,
    company: "네이버",
    title: "프론트엔드 개발자",
    location: "성남시 분당구",
    type: "정규직",
    match: 72,
    badge: "prep",
    logo: "N",
    matchedSkills: ["React", "TypeScript", "Git"],
    missingSkills: ["Docker", "AWS"],
    salary: "4,500만원 ~ 6,000만원",
  },
  {
    id: 2,
    company: "카카오",
    title: "웹 개발자",
    location: "성남시 판교",
    type: "정규직",
    match: 68,
    badge: "prep",
    logo: "K",
    matchedSkills: ["JavaScript", "React"],
    missingSkills: ["Kubernetes", "CI/CD"],
    salary: "4,000만원 ~ 5,500만원",
  },
  {
    id: 3,
    company: "토스",
    title: "React 개발자",
    location: "서울 강남구",
    type: "정규직",
    match: 89,
    badge: "apply",
    logo: "T",
    matchedSkills: ["React", "TypeScript", "Node.js", "Git"],
    missingSkills: [],
    salary: "5,000만원 ~ 7,000만원",
  },
  {
    id: 4,
    company: "라인",
    title: "소프트웨어 엔지니어",
    location: "서울 강남구",
    type: "정규직",
    match: 54,
    badge: "stretch",
    logo: "L",
    matchedSkills: ["JavaScript", "Python"],
    missingSkills: ["Java", "Spring", "Kotlin"],
    salary: "4,500만원 ~ 6,500만원",
  },
  {
    id: 5,
    company: "쿠팡",
    title: "풀스택 개발자",
    location: "서울 송파구",
    type: "정규직",
    match: 75,
    badge: "prep",
    logo: "C",
    matchedSkills: ["React", "Node.js", "TypeScript"],
    missingSkills: ["AWS", "Redis"],
    salary: "4,800만원 ~ 6,500만원",
  },
  {
    id: 6,
    company: "배달의민족",
    title: "프론트엔드 엔지니어",
    location: "서울 송파구",
    type: "정규직",
    match: 82,
    badge: "apply",
    logo: "B",
    matchedSkills: ["React", "TypeScript", "Git", "Redux"],
    missingSkills: ["GraphQL"],
    salary: "4,500만원 ~ 6,000만원",
  },
];

const filterOptions = {
  matchLevel: [
    { value: "all", label: "전체" },
    { value: "apply", label: "지원 가능 (85%+)" },
    { value: "prep", label: "준비 필요 (60-84%)" },
    { value: "stretch", label: "도전 목표 (<60%)" },
  ],
  jobType: [
    { value: "all", label: "전체" },
    { value: "fulltime", label: "정규직" },
    { value: "intern", label: "인턴" },
    { value: "contract", label: "계약직" },
  ],
  location: [
    { value: "all", label: "전체" },
    { value: "seoul", label: "서울" },
    { value: "gyeonggi", label: "경기" },
    { value: "remote", label: "원격" },
  ],
};

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    matchLevel: "all",
    jobType: "all",
    location: "all",
  });
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      filters.matchLevel === "all" || job.badge === filters.matchLevel;

    return matchesSearch && matchesLevel;
  });

  const toggleSave = (jobId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case "apply":
        return "match-high";
      case "prep":
        return "match-medium";
      case "stretch":
        return "match-low";
      default:
        return "";
    }
  };

  const getBadgeLabel = (badge: string) => {
    switch (badge) {
      case "apply":
        return "지원 가능";
      case "prep":
        return "준비 필요";
      case "stretch":
        return "도전 목표";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">채용 찾기</h1>
        <p className="text-foreground-secondary">
          내 프로필에 맞는 {jobs.length}개의 채용이 있어요
        </p>
      </div>

      {/* Search and Filters */}
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
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          필터
          {Object.values(filters).some((v) => v !== "all") && (
            <span className="ml-2 w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
              {Object.values(filters).filter((v) => v !== "all").length}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-card rounded-xl border border-border p-4 animate-fade-in-down">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">필터</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-foreground-muted hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Match Level */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                매칭 수준
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.matchLevel.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setFilters({ ...filters, matchLevel: option.value })
                    }
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filters.matchLevel === option.value
                        ? "bg-primary-500 text-white"
                        : "bg-background-secondary text-foreground-secondary hover:bg-background-tertiary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                고용 형태
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.jobType.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setFilters({ ...filters, jobType: option.value })
                    }
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filters.jobType === option.value
                        ? "bg-primary-500 text-white"
                        : "bg-background-secondary text-foreground-secondary hover:bg-background-tertiary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                지역
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.location.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setFilters({ ...filters, location: option.value })
                    }
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filters.location === option.value
                        ? "bg-primary-500 text-white"
                        : "bg-background-secondary text-foreground-secondary hover:bg-background-tertiary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear filters */}
          {Object.values(filters).some((v) => v !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() =>
                setFilters({ matchLevel: "all", jobType: "all", location: "all" })
              }
            >
              필터 초기화
            </Button>
          )}
        </div>
      )}

      {/* Results count */}
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

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="bg-card rounded-xl border border-border p-5 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-background-secondary flex items-center justify-center text-foreground font-bold text-lg group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30 transition-colors">
                  {job.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-foreground-secondary">{job.company}</p>
                </div>
              </div>
              <button
                onClick={(e) => toggleSave(job.id, e)}
                className={`p-2 rounded-lg transition-colors ${
                  savedJobs.includes(job.id)
                    ? "text-primary-500 bg-primary-50 dark:bg-primary-950/30"
                    : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${savedJobs.includes(job.id) ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Job Info */}
            <div className="flex flex-wrap gap-3 mb-4 text-sm text-foreground-secondary">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {job.type}
              </span>
            </div>

            {/* Match Score */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14">
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
                      strokeDasharray={`${job.match * 1.51} 151`}
                      strokeLinecap="round"
                      className={
                        job.badge === "apply"
                          ? "text-success-500"
                          : job.badge === "prep"
                          ? "text-warning-500"
                          : "text-error-500"
                      }
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground">
                      {job.match}%
                    </span>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getBadgeStyle(
                      job.badge
                    )}`}
                  >
                    {getBadgeLabel(job.badge)}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground-muted group-hover:text-primary-500 transition-colors" />
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {job.matchedSkills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 text-xs"
                >
                  <Check className="w-3 h-3" />
                  {skill}
                </span>
              ))}
              {job.missingSkills.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-full bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
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
              setFilters({ matchLevel: "all", jobType: "all", location: "all" });
            }}
          >
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  );
}
