"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ImageIcon,
} from "lucide-react";
import { getJobById } from "@/lib/data/jobs";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import { MatchExplanationModal } from "@/components/jobs/match-explanation-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LINKAREER_ID_OFFSET } from "@/lib/data/linkareer";

const ANALYZE_CACHE_KEY_PREFIX = "careermap-job-analyze-";

/** 커피챗 프로필 목업: public/assets/coffeechat/ 에 이미지 추가 시 표시됨 (PNG/WebP, 정사각형 320px 권장) */
const COFFEECHAT_MENTORS = [
  { name: "이지연 (Sophia Lee)", badge: "RECRUITER", role: "Vinsign 디자인/프로덕트 채용 총괄", bio: "채용 프로세스 및 처우 관련 문의", initial: "S", color: "bg-emerald-100 text-emerald-700", image: "/assets/coffeechat/mentor-sophia.png" },
  { name: "박준서 (James Park)", badge: "DESIGN LEAD", role: "Vinsign 프로덕트 디자인 팀 리드", bio: "디자인 시스템 및 팀 문화 관련 문의", initial: "J", color: "bg-blue-100 text-blue-700", image: "/assets/coffeechat/mentor-james.png" },
  { name: "김다희 (Chloe Kim)", badge: "SENIOR DESIGNER", role: "Vinsign 시니어 프로덕트 디자이너", bio: "실무 프로세스 및 협업 방식 관련 문의", initial: "C", color: "bg-orange-100 text-orange-700", image: "/assets/coffeechat/mentor-chloe.png" },
] as const;

function MentorAvatar({ mentor }: { mentor: (typeof COFFEECHAT_MENTORS)[number] }) {
  const [imgFailed, setImgFailed] = useState(false);
  const useImage = mentor.image && !imgFailed;
  return (
    <div className={`relative w-20 h-20 min-w-[5rem] min-h-[5rem] rounded-[2rem] overflow-hidden shrink-0 flex items-center justify-center ${useImage ? "bg-background-secondary" : mentor.color}`}>
      {useImage ? (
        <img
          src={mentor.image}
          alt={mentor.name}
          className="absolute inset-0 w-full h-full object-cover object-center block"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-3xl font-bold">{mentor.initial}</span>
      )}
    </div>
  );
}

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
  detailImageUrl?: string | null;
  companyType?: string;
  recruitCategory?: string;
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

function formatEmploymentType(et: string | string[] | undefined):
 string {
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

function formatDateKorean(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Parse 모집직무 from description when not provided by API. */
function getRecruitCategoryDisplay(
  description: string | undefined,
  recruitCategory: string | undefined
): string {
  if (recruitCategory) return recruitCategory;
  if (!description) return "—";
  const m = description.match(/모집직무\s*[:\s]*([^\n]+)/);
  return m?.[1]?.trim() ?? "—";
}

/** Analyzed section from /api/linkareer/activity/[activityId]/analyze */
interface AnalyzedSection {
  title: string;
  content: string;
}

function LinkareerJobDetailView({
  detail,
  jobIdNum,
  activityId,
  isSaved,
  onToggleSaved,
}: {
  detail: LinkareerActivityDetail;
  jobIdNum: number;
  activityId: string;
  isSaved: boolean;
  onToggleSaved: () => void;
}) {
  const jp = detail.jobPosting;
  const org = jp.hiringOrganization;
  const logoUrl = org?.logo || jp.image?.contentUrl;
  const sourceUrl = detail.sourceUrl;

  const [analyzedSections, setAnalyzedSections] = useState<AnalyzedSection[] | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const [textAnalyzedSections, setTextAnalyzedSections] = useState<AnalyzedSection[] | null>(null);
  const [textAnalyzeLoading, setTextAnalyzeLoading] = useState(false);
  const [textAnalyzeError, setTextAnalyzeError] = useState<string | null>(null);

  const fetchAnalyze = () => {
    if (!detail.detailImageUrl || !activityId) return;
    setAnalyzeLoading(true);
    setAnalyzeError(null);
    fetch(`/api/linkareer/activity/${activityId}/analyze`)
      .then(async (res) => {
        if (!res.ok) {
          let msg = res.status === 404 ? "상세 분석을 사용할 수 없어요" : "분석 요청에 실패했어요";
          try {
            const body = (await res.json()) as { error?: string };
            if (body?.error) msg = body.error;
          } catch {
            // ignore non-JSON body
          }
          throw new Error(msg);
        }
        return res.json() as Promise<{ sections?: AnalyzedSection[] }>;
      })
      .then((data) => {
        const list = data.sections ?? [];
        const sections = Array.isArray(list) ? list : [];
        setAnalyzedSections(sections);
        try {
          localStorage.setItem(
            `${ANALYZE_CACHE_KEY_PREFIX}${activityId}`,
            JSON.stringify({ sections, fetchedAt: Date.now() })
          );
        } catch {
          // ignore quota/private
        }
      })
      .catch((e: Error) => {
        setAnalyzeError(e.message);
        setAnalyzedSections(null);
      })
      .finally(() => setAnalyzeLoading(false));
  };

  const fetchTextAnalyze = () => {
    const raw = jp.description?.trim();
    if (!raw) return;
    setTextAnalyzeLoading(true);
    setTextAnalyzeError(null);
    fetch("/api/analyze-job-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: raw }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data?.error ?? "분석에 실패했어요");
        }
        return res.json() as Promise<{ sections?: AnalyzedSection[] }>;
      })
      .then((data) => {
        const list = data.sections ?? [];
        setTextAnalyzedSections(Array.isArray(list) ? list : []);
      })
      .catch((e: Error) => {
        setTextAnalyzeError(e.message);
        setTextAnalyzedSections(null);
      })
      .finally(() => setTextAnalyzeLoading(false));
  };

  useEffect(() => {
    if (!detail.detailImageUrl || !activityId) return;
    try {
      const raw = localStorage.getItem(`${ANALYZE_CACHE_KEY_PREFIX}${activityId}`);
      if (raw) {
        const parsed = JSON.parse(raw) as { sections?: AnalyzedSection[] };
        if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
          setAnalyzedSections(parsed.sections);
          return;
        }
      }
    } catch {
      // ignore
    }
    fetchAnalyze();
  }, [activityId, detail.detailImageUrl]);

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>채용 목록으로</span>
      </Link>

      <div className="bg-card rounded-2xl p-6 mb-6 shadow-sm">
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

        <Tabs defaultValue="intro" className="mb-6">
          <TabsList className="w-full grid grid-cols-2 rounded-xl bg-background-secondary/50 p-1 h-auto">
            <TabsTrigger value="intro" className="rounded-lg py-2.5 text-sm">
              상세 정보
            </TabsTrigger>
            <TabsTrigger value="coffee" className="rounded-lg py-2.5 text-sm">
              커피챗
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intro" className="mt-5">
            <Tabs defaultValue="detail" className="w-full">
              <div className="flex justify-end mb-4">
                <TabsList className="bg-background-secondary/50 p-1 h-auto inline-flex">
                  <TabsTrigger value="detail" className="px-4 py-1.5 text-xs">상세 내용</TabsTrigger>
                  <TabsTrigger value="summary" className="px-4 py-1.5 text-xs">요약</TabsTrigger>
                  <TabsTrigger value="info" className="px-4 py-1.5 text-xs">공고 정보</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="detail" className="mt-0">
                {!detail.detailImageUrl && (
                  <>
                    {textAnalyzedSections && textAnalyzedSections.length > 0 ? (
                      <div className="space-y-4">
                        {textAnalyzedSections.map((section, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-border bg-card p-5 shadow-sm"
                          >
                            <h3 className="font-semibold text-foreground mb-3">
                              {section.title}
                            </h3>
                            <p className="text-foreground-secondary whitespace-pre-line leading-relaxed text-sm">
                              {section.content}
                            </p>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchTextAnalyze}
                          disabled={textAnalyzeLoading}
                        >
                          {textAnalyzeLoading ? "다시 분석 중…" : "다시 정리하기"}
                        </Button>
                      </div>
                    ) : (
                      <>
                        {textAnalyzeLoading && (
                          <div className="rounded-xl bg-background-secondary/30 py-12 text-center mb-4">
                            <p className="text-foreground-secondary">AI가 공고를 정리하고 있어요…</p>
                            <div className="mt-3 flex justify-center gap-1">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500" />
                              <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500 [animation-delay:0.2s]" />
                              <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500 [animation-delay:0.4s]" />
                            </div>
                          </div>
                        )}
                        {!textAnalyzeLoading && (
                          <>
                            <p className="text-foreground-secondary whitespace-pre-line leading-relaxed mb-4">
                              {jp.description ?? "—"}
                            </p>
                            {jp.description?.trim() && (
                              <Button
                                onClick={fetchTextAnalyze}
                                disabled={textAnalyzeLoading}
                              >
                                AI로 정리하기
                              </Button>
                            )}
                            {textAnalyzeError && (
                              <p className="text-sm text-destructive mt-2">{textAnalyzeError}</p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
                {detail.detailImageUrl && (
                  <>
                    {analyzeLoading && (
                      <div className="rounded-xl bg-background-secondary/30 py-12 text-center">
                        <p className="text-foreground-secondary">상세 내용 분석 중...</p>
                        <div className="mt-3 flex justify-center gap-1">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500" />
                          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500 [animation-delay:0.2s]" />
                          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500 [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                    {!analyzeLoading && analyzeError && (
                      <div className="space-y-4">
                        <img
                          src={detail.detailImageUrl}
                          alt={jp.title ?? "채용 공고 상세"}
                          className="max-w-full w-full rounded-lg"
                        />
                        <p className="text-sm text-foreground-muted">{analyzeError}</p>
                        <Button variant="outline" size="sm" onClick={() => fetchAnalyze()}>
                          OCR 다시 시도
                        </Button>
                      </div>
                    )}
                    {!analyzeLoading && analyzedSections && analyzedSections.length > 0 && !showOriginalImage && (
                      <div className="space-y-4">
                        {analyzedSections.map((section, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-border bg-card p-5 shadow-sm"
                          >
                            <h3 className="font-semibold text-foreground mb-3">
                              {section.title}
                            </h3>
                            <p className="text-foreground-secondary whitespace-pre-line leading-relaxed text-sm">
                              {section.content}
                            </p>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setShowOriginalImage(true)}
                          className="inline-flex items-center gap-2 rounded-lg bg-background-secondary/50 px-3 py-2 text-sm text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
                        >
                          <ImageIcon className="w-4 h-4" />
                          원본 이미지 보기
                        </button>
                      </div>
                    )}
                    {!analyzeLoading && showOriginalImage && detail.detailImageUrl && (
                      <div className="space-y-3">
                        <img
                          src={detail.detailImageUrl}
                          alt={jp.title ?? "채용 공고 상세"}
                          className="max-w-full w-full rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOriginalImage(false)}
                          className="text-sm text-primary-500 hover:underline"
                        >
                          구조화된 보기로 돌아가기
                        </button>
                      </div>
                    )}
                    {!analyzeLoading && detail.detailImageUrl && !analyzedSections?.length && !analyzeError && (
                      <img
                        src={detail.detailImageUrl}
                        alt={jp.title ?? "채용 공고 상세"}
                        className="max-w-full w-full rounded-lg"
                      />
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="summary" className="mt-0">
                <div className="rounded-xl bg-background-secondary/30 p-5">
                  <p className="text-foreground-secondary whitespace-pre-line leading-relaxed">
                    {jp.description ?? "요약 내용이 없습니다."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="info" className="mt-0">
                <dl className="grid gap-4 text-sm rounded-xl bg-background-secondary/30 p-5">
                  {detail.companyType != null && detail.companyType !== "" && (
                    <div>
                      <dt className="text-foreground-muted font-medium mb-1">기업형태</dt>
                      <dd className="text-foreground">{detail.companyType}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-foreground-muted font-medium mb-1">접수기간</dt>
                    <dd className="text-foreground">
                      시작일 {formatDateKorean(jp.datePosted)} · 마감일 {formatDateKorean(jp.validThrough)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-foreground-muted font-medium mb-1">채용형태</dt>
                    <dd className="text-foreground">{formatEmploymentType(jp.employmentType)}</dd>
                  </div>
                  <div>
                    <dt className="text-foreground-muted font-medium mb-1">모집직무</dt>
                    <dd className="text-foreground">
                      {getRecruitCategoryDisplay(jp.description, detail.recruitCategory)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-foreground-muted font-medium mb-1">근무지역</dt>
                    <dd className="text-foreground">{formatLocation(jp.jobLocation)}</dd>
                  </div>
                  {org?.sameAs && (
                    <div>
                      <dt className="text-foreground-muted font-medium mb-1">홈페이지</dt>
                      <dd className="text-foreground">
                        <a
                          href={org.sameAs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-500 hover:underline break-all"
                        >
                          {org.sameAs}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="coffee" className="mt-6">
            <div className="min-h-[511px] space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">현직자 커피챗</h3>
                  <p className="text-sm text-foreground-secondary">이 회사에 재직 중인 현직자에게 궁금한 점을 물어보세요.</p>
                </div>
              </div>

              <div className="space-y-4">
                {COFFEECHAT_MENTORS.map((mentor, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl border border-border bg-card">
                    <div className="relative w-20 h-20 shrink-0">
                      <MentorAvatar mentor={mentor} />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0077B5] flex items-center justify-center text-white border border-card pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xl font-bold text-foreground">{mentor.name}</h4>
                        <span className="px-2.5 py-1 rounded-md bg-white dark:bg-white/10 text-foreground dark:text-foreground text-[10px] font-bold uppercase tracking-wide border border-border">
                          {mentor.badge}
                        </span>
                      </div>
                      <p className="text-base text-foreground-secondary font-medium">{mentor.role}</p>
                      <p className="text-sm text-foreground-muted">{mentor.bio}</p>
                    </div>

                    <Button className="shrink-0 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white px-6 h-12" size="lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mr-2">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      프로필 확인하기
                    </Button>
                  </div>
                ))}

              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-5 h-5 mr-2" />
              링커리어에서 지원하기
            </a>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/prepare/skills?job=${jobIdNum}`}>
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
        activityId={activityId}
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

      <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-sm">
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

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-foreground-secondary border-b border-border pb-6">
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
        <div className="bg-background-secondary rounded-xl p-4 mb-8">
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

        <Tabs defaultValue="intro" className="mb-8">
          <TabsList className="w-full grid grid-cols-2 rounded-xl bg-background-secondary/50 p-1 h-auto">
            <TabsTrigger value="intro" className="rounded-lg py-2.5 text-sm">
              상세 정보
            </TabsTrigger>
            <TabsTrigger value="coffee" className="rounded-lg py-2.5 text-sm">
              커피챗
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intro" className="mt-6">
            <div className="border border-border rounded-xl overflow-hidden">
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
                    <p className="text-foreground-secondary whitespace-pre-line leading-relaxed text-sm">
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
                        className="flex items-start gap-2 text-foreground-secondary text-sm"
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
                        className="flex items-start gap-2 text-foreground-secondary text-sm"
                      >
                        <Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
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
                        className="flex items-start gap-2 text-foreground-secondary text-sm"
                      >
                        <span className="text-primary-500 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="coffee" className="mt-6">
            <div className="min-h-[511px] space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">현직자 커피챗</h3>
                  <p className="text-sm text-foreground-secondary">이 회사에 재직 중인 현직자에게 궁금한 점을 물어보세요.</p>
                </div>
              </div>

              <div className="space-y-4">
                {COFFEECHAT_MENTORS.map((mentor, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl border border-border bg-card">
                    <div className="relative w-20 h-20 shrink-0">
                      <MentorAvatar mentor={mentor} />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0077B5] flex items-center justify-center text-white border border-card pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xl font-bold text-foreground">{mentor.name}</h4>
                        <span className="px-2.5 py-1 rounded-md bg-white dark:bg-white/10 text-foreground dark:text-foreground text-[10px] font-bold uppercase tracking-wide border border-border">
                          {mentor.badge}
                        </span>
                      </div>
                      <p className="text-base text-foreground-secondary font-medium">{mentor.role}</p>
                      <p className="text-sm text-foreground-muted">{mentor.bio}</p>
                    </div>

                    <Button className="shrink-0 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white px-6 h-12" size="lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mr-2">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      프로필 확인하기
                    </Button>
                  </div>
                ))}

              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <Button asChild className="flex-1">
            <Link href={`/prepare/skills?job=${job.id}`}>
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
