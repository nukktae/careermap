"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  ExternalLink,
  Target,
  FileText,
  Lightbulb,
  Plus,
} from "lucide-react";

// Mock job detail data
const jobData = {
  id: 1,
  company: "네이버",
  title: "프론트엔드 개발자",
  location: "성남시 분당구",
  type: "정규직",
  experience: "신입 ~ 3년",
  salary: "4,500만원 ~ 6,000만원",
  deadline: "2026-02-28",
  match: 72,
  badge: "prep",
  logo: "N",
  description: `네이버의 다양한 서비스를 함께 만들어갈 프론트엔드 개발자를 모집합니다.

네이버는 대한민국 대표 인터넷 기업으로, 검색, 쇼핑, 페이, 클라우드 등 다양한 서비스를 제공하고 있습니다. 우리는 사용자 중심의 서비스 개발을 지향하며, 최신 기술을 적극적으로 도입하고 있습니다.`,
  responsibilities: [
    "네이버 서비스의 웹 프론트엔드 개발 및 유지보수",
    "React, TypeScript를 활용한 SPA 개발",
    "성능 최적화 및 사용자 경험 개선",
    "디자이너, 백엔드 개발자와의 협업",
    "코드 리뷰 및 기술 문서 작성",
  ],
  requirements: [
    "React, TypeScript 경험 필수",
    "HTML, CSS, JavaScript에 대한 깊은 이해",
    "Git을 활용한 협업 경험",
    "RESTful API 연동 경험",
  ],
  preferred: [
    "대규모 서비스 개발 경험",
    "Docker, Kubernetes 경험",
    "AWS 또는 클라우드 서비스 경험",
    "오픈소스 기여 경험",
  ],
  benefits: [
    "유연근무제 (자율 출퇴근)",
    "재택근무 지원",
    "건강검진 및 의료비 지원",
    "교육비 지원 (연 300만원)",
    "사내 카페테리아",
  ],
  matchBreakdown: {
    skills: { score: 32, total: 40, matched: ["React", "TypeScript", "Git"], missing: ["Docker", "AWS"] },
    experience: { score: 20, total: 30, note: "인턴 경험으로 기본 점수 획득" },
    education: { score: 15, total: 15, note: "학력 요건 충족" },
    projects: { score: 5, total: 15, note: "관련 프로젝트 1개 확인" },
  },
  similarJobs: [
    { id: 2, company: "카카오", title: "웹 개발자", match: 68, logo: "K" },
    { id: 5, company: "쿠팡", title: "풀스택 개발자", match: 75, logo: "C" },
  ],
};

export default function JobDetailPage() {
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "description",
    "requirements",
  ]);
  const [showMatchBreakdown, setShowMatchBreakdown] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
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
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>채용 목록으로</span>
      </Link>

      {/* Header */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-background-secondary flex items-center justify-center text-foreground font-bold text-2xl">
              {jobData.logo}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {jobData.title}
              </h1>
              <p className="text-lg text-foreground-secondary">{jobData.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-lg transition-colors ${
                isSaved
                  ? "text-primary-500 bg-primary-50 dark:bg-primary-950/30"
                  : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </button>
            <button className="p-2.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Job Info */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-foreground-secondary">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {jobData.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            {jobData.type}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {jobData.experience}
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            {jobData.salary}
          </span>
        </div>

        {/* Match Score Card */}
        <div className="bg-background-secondary rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-background"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={`${jobData.match * 2.14} 214`}
                    strokeLinecap="round"
                    className={
                      jobData.badge === "apply"
                        ? "text-success-500"
                        : jobData.badge === "prep"
                        ? "text-warning-500"
                        : "text-error-500"
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-foreground">
                    {jobData.match}%
                  </span>
                </div>
              </div>
              <div>
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold mb-2 ${getBadgeStyle(
                    jobData.badge
                  )}`}
                >
                  {getBadgeLabel(jobData.badge)}
                </span>
                <p className="text-sm text-foreground-secondary">
                  Docker, AWS 스킬을 추가하면 +15% 향상 가능
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMatchBreakdown(!showMatchBreakdown)}
            >
              {showMatchBreakdown ? "닫기" : "상세 보기"}
              {showMatchBreakdown ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>

          {/* Match Breakdown */}
          {showMatchBreakdown && (
            <div className="border-t border-border pt-4 mt-4 space-y-4 animate-fade-in-down">
              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    기술 스킬 (40%)
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {jobData.matchBreakdown.skills.score}/{jobData.matchBreakdown.skills.total}
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{
                      width: `${(jobData.matchBreakdown.skills.score / jobData.matchBreakdown.skills.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {jobData.matchBreakdown.skills.matched.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 text-xs"
                    >
                      <Check className="w-3 h-3" />
                      {skill}
                    </span>
                  ))}
                  {jobData.matchBreakdown.skills.missing.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 text-xs"
                    >
                      <X className="w-3 h-3" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    경력 (30%)
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {jobData.matchBreakdown.experience.score}/{jobData.matchBreakdown.experience.total}
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{
                      width: `${(jobData.matchBreakdown.experience.score / jobData.matchBreakdown.experience.total) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-foreground-secondary">
                  {jobData.matchBreakdown.experience.note}
                </p>
              </div>

              {/* Education */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    학력 (15%)
                  </span>
                  <span className="text-sm font-semibold text-success-600">
                    {jobData.matchBreakdown.education.score}/{jobData.matchBreakdown.education.total}
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-success-500 rounded-full w-full" />
                </div>
                <p className="text-xs text-foreground-secondary">
                  {jobData.matchBreakdown.education.note}
                </p>
              </div>

              {/* Projects */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    프로젝트 (15%)
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {jobData.matchBreakdown.projects.score}/{jobData.matchBreakdown.projects.total}
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{
                      width: `${(jobData.matchBreakdown.projects.score / jobData.matchBreakdown.projects.total) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-foreground-secondary">
                  {jobData.matchBreakdown.projects.note}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link href={`/prepare/plan?job=${jobData.id}`}>
              <Target className="w-5 h-5 mr-2" />
              이 채용 준비하기
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/track">
              <Plus className="w-5 h-5 mr-2" />
              지원 현황에 추가
            </Link>
          </Button>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
        {/* Description */}
        <div className="border-b border-border">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
            onClick={() => toggleSection("description")}
          >
            <h2 className="font-semibold text-foreground">회사 소개</h2>
            {expandedSections.includes("description") ? (
              <ChevronUp className="w-5 h-5 text-foreground-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-foreground-muted" />
            )}
          </button>
          {expandedSections.includes("description") && (
            <div className="px-4 pb-4">
              <p className="text-foreground-secondary whitespace-pre-line leading-relaxed">
                {jobData.description}
              </p>
            </div>
          )}
        </div>

        {/* Responsibilities */}
        <div className="border-b border-border">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
            onClick={() => toggleSection("responsibilities")}
          >
            <h2 className="font-semibold text-foreground">주요 업무</h2>
            {expandedSections.includes("responsibilities") ? (
              <ChevronUp className="w-5 h-5 text-foreground-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-foreground-muted" />
            )}
          </button>
          {expandedSections.includes("responsibilities") && (
            <ul className="px-4 pb-4 space-y-2">
              {jobData.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-foreground-secondary">
                  <span className="text-primary-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Requirements */}
        <div className="border-b border-border">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
            onClick={() => toggleSection("requirements")}
          >
            <h2 className="font-semibold text-foreground">자격 요건</h2>
            {expandedSections.includes("requirements") ? (
              <ChevronUp className="w-5 h-5 text-foreground-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-foreground-muted" />
            )}
          </button>
          {expandedSections.includes("requirements") && (
            <ul className="px-4 pb-4 space-y-2">
              {jobData.requirements.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-foreground-secondary">
                  <Check className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Preferred */}
        <div className="border-b border-border">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
            onClick={() => toggleSection("preferred")}
          >
            <h2 className="font-semibold text-foreground">우대 사항</h2>
            {expandedSections.includes("preferred") ? (
              <ChevronUp className="w-5 h-5 text-foreground-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-foreground-muted" />
            )}
          </button>
          {expandedSections.includes("preferred") && (
            <ul className="px-4 pb-4 space-y-2">
              {jobData.preferred.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-foreground-secondary">
                  <span className="text-warning-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Benefits */}
        <div>
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-background-secondary transition-colors"
            onClick={() => toggleSection("benefits")}
          >
            <h2 className="font-semibold text-foreground">복리후생</h2>
            {expandedSections.includes("benefits") ? (
              <ChevronUp className="w-5 h-5 text-foreground-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-foreground-muted" />
            )}
          </button>
          {expandedSections.includes("benefits") && (
            <ul className="px-4 pb-4 space-y-2">
              {jobData.benefits.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-foreground-secondary">
                  <span className="text-primary-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Similar Jobs */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <h2 className="font-semibold text-foreground mb-4">이런 채용도 있어요</h2>
        <div className="space-y-3">
          {jobData.similarJobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-background-secondary flex items-center justify-center text-foreground font-bold">
                {job.logo}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{job.title}</h3>
                <p className="text-sm text-foreground-secondary">{job.company}</p>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {job.match}%
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
