"use client";

import { useState, useEffect } from "react";
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
  Target,
  Plus,
  ExternalLink,
} from "lucide-react";
import { getJobById, getSimilarJobs } from "@/lib/data/jobs";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import { MatchExplanationModal } from "@/components/jobs/match-explanation-modal";
import { LINKAREER_ID_OFFSET } from "@/lib/data/linkareer";

/** API response for /api/linkareer/activity/[activityId] */
interface LinkareerActivityDetail {
  activityId: string;
  sourceUrl: string;
  jobPosting: {
    title?: string;
    description?: string;
    datePosted?: string;
    validThrough?: string;
    employmentType?: string | string[];
    experienceRequirements?: string | string[];
    educationRequirements?: string;
    jobLocation?: Array<{
      address?: {
        addressRegion?: string;
        addressLocality?: string;
        streetAddress?: string;
        addressCountry?: string;
      };
    }>;
    hiringOrganization?: {
      name?: string;
      logo?: string;
      sameAs?: string;
    };
    image?: { contentUrl?: string };
  };
}

function getBadgeStyle(badge: string) {
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
}

function getBadgeLabel(badge: string) {
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
}

function formatEmploymentType(et: string | string[] | undefined): string {
  if (!et) return "—";
  const arr = Array.isArray(et) ? et : [et];
  const map: Record<string, string> = {
    INTERN: "인턴",
    FULL_TIME: "정규직",
    PART_TIME: "파트타임",
    CONTRACTOR: "계약직",
  };
  return arr.map((e) => map[e] ?? e).join(", ") || "—";
}

function formatLocation(loc: LinkareerActivityDetail["jobPosting"]["jobLocation"]): string {
  if (!loc?.[0]?.address) return "—";
  const a = loc[0].address;
  const parts = [a.addressRegion, a.addressLocality, a.streetAddress].filter(Boolean);
  return parts.join(" ") || "—";
}

function LinkareerJobDetailView({
  detail,
  jobIdNum,
  isSaved,
  onToggleSaved,
}: {
  detail: LinkareerActivityDetail;
  jobIdNum: number;
  isSaved: boolean;
  onToggleSaved: () => void;
}) {
  const jp = detail.jobPosting;
  const org = jp.hiringOrganization;
  const logoUrl = org?.logo || jp.image?.contentUrl;
  const sourceUrl = detail.sourceUrl;

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>채용 목록으로</span>
      </Link>

      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-background-secondary flex items-center justify-center text-foreground font-bold text-2xl overflow-hidden">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="object-cover w-full h-full"
                />
              ) : (
                (org?.name ?? "L").charAt(0)
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {jp.title ?? "—"}
              </h1>
              <p className="text-lg text-foreground-secondary">{org?.name ?? "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSaved}
              className={`p-2.5 rounded-lg transition-colors ${
                isSaved
                  ? "text-primary-500 bg-primary-50 dark:bg-primary-950/30"
                  : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </button>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary"
              aria-label="링커리어에서 보기"
            >
              <Share2 className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-foreground-secondary">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {formatLocation(jp.jobLocation)}
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            {formatEmploymentType(jp.employmentType)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {jp.validThrough
              ? new Date(jp.validThrough).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </span>
        </div>

        {jp.description && (
          <div className="mb-6">
            <h2 className="font-semibold text-foreground mb-2">상세 내용</h2>
            <p className="text-foreground-secondary whitespace-pre-line leading-relaxed">
              {jp.description}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-5 h-5 mr-2" />
              링커리어에서 지원하기
            </a>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/prepare/plan?job=${jobIdNum}`}>
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
    </div>
  );
}

export default function JobDetailPage() {
  const params = useParams();
  const rawId = params?.id ? String(params.id) : "";
  const jobIdNum = rawId ? parseInt(rawId, 10) : NaN;
  const isLinkareer = !isNaN(jobIdNum) && jobIdNum >= LINKAREER_ID_OFFSET;
  const activityId = isLinkareer ? String(jobIdNum - LINKAREER_ID_OFFSET) : "";

  const [linkareerDetail, setLinkareerDetail] = useState<LinkareerActivityDetail | null>(null);
  const [linkareerLoading, setLinkareerLoading] = useState(isLinkareer);
  const [linkareerError, setLinkareerError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLinkareer || !activityId) return;
    setLinkareerLoading(true);
    setLinkareerError(null);
    fetch(`/api/linkareer/activity/${activityId}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "채용 정보를 찾을 수 없어요" : "불러오기에 실패했어요");
        return res.json();
      })
      .then((data: LinkareerActivityDetail) => setLinkareerDetail(data))
      .catch((e: Error) => setLinkareerError(e.message))
      .finally(() => setLinkareerLoading(false));
  }, [isLinkareer, activityId]);

  const job = isLinkareer ? null : getJobById(rawId);
  const { isSaved, toggleSaved } = useSavedJobs();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "description",
    "requirements",
  ]);
  const [matchModalOpen, setMatchModalOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  if (isLinkareer) {
    if (linkareerLoading) {
      return (
        <div className="max-w-4xl mx-auto">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>채용 목록으로</span>
          </Link>
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <p className="text-foreground-secondary">채용 정보를 불러오는 중...</p>
          </div>
        </div>
      );
    }
    if (linkareerError || !linkareerDetail) {
      return (
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            채용 정보를 찾을 수 없어요
          </h2>
          <p className="text-foreground-secondary mb-4">
            {linkareerError ?? "해당 채용이 삭제되었거나 존재하지 않습니다."}
          </p>
          <Button asChild variant="outline">
            <Link href="/jobs">채용 목록으로</Link>
          </Button>
        </div>
      );
    }
    return (
      <LinkareerJobDetailView
        detail={linkareerDetail}
        jobIdNum={jobIdNum}
        isSaved={isSaved(jobIdNum)}
        onToggleSaved={() => toggleSaved(jobIdNum)}
      />
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          채용 정보를 찾을 수 없어요
        </h2>
        <p className="text-foreground-secondary mb-4">
          해당 채용이 삭제되었거나 존재하지 않습니다.
        </p>
        <Button asChild variant="outline">
          <Link href="/jobs">채용 목록으로</Link>
        </Button>
      </div>
    );
  }

  const similarJobs = getSimilarJobs(job.id);
  const saved = isSaved(job.id);

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>채용 목록으로</span>
      </Link>

      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-background-secondary flex items-center justify-center text-foreground font-bold text-2xl">
              {job.logo}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {job.title}
              </h1>
              <p className="text-lg text-foreground-secondary">{job.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaved(job.id)}
              className={`p-2.5 rounded-lg transition-colors ${
                saved
                  ? "text-primary-500 bg-primary-50 dark:bg-primary-950/30"
                  : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
            </button>
            <button className="p-2.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-foreground-secondary">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            {job.type}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {job.experience}
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            {job.salary}
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
                    strokeDasharray={`${job.match * 2.14} 214`}
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
                  <span className="text-xl font-bold text-foreground">
                    {job.match}%
                  </span>
                </div>
              </div>
              <div>
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold mb-2 ${getBadgeStyle(
                    job.badge
                  )}`}
                >
                  {getBadgeLabel(job.badge)}
                </span>
                <p className="text-sm text-foreground-secondary">
                  {job.matchBreakdown.skills.skillsImpact ??
                    "스킬을 보강하면 매칭이 올라갈 수 있어요"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMatchModalOpen(true)}
            >
              매칭 상세 보기
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <MatchExplanationModal
          open={matchModalOpen}
          onOpenChange={setMatchModalOpen}
          job={job}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link href={`/prepare/plan?job=${job.id}`}>
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
                {job.description}
              </p>
            </div>
          )}
        </div>

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
              {job.responsibilities.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-foreground-secondary"
                >
                  <span className="text-primary-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

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
              {job.requirements.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-foreground-secondary"
                >
                  <Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

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
              {job.preferred.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-foreground-secondary"
                >
                  <span className="text-warning-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

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
              {job.benefits.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-foreground-secondary"
                >
                  <span className="text-primary-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {similarJobs.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-4">
          <h2 className="font-semibold text-foreground mb-4">
            이런 채용도 있어요
          </h2>
          <div className="space-y-3">
            {similarJobs.map((similar) => (
              <Link
                key={similar.id}
                href={`/jobs/${similar.id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-background-secondary flex items-center justify-center text-foreground font-bold">
                  {similar.logo}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{similar.title}</h3>
                  <p className="text-sm text-foreground-secondary">
                    {similar.company}
                  </p>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {similar.match}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
