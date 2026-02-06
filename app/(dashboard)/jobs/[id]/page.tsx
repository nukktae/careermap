"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Building2,
  MapPin,
  Bookmark,
  Share2,
  Calendar,
  ChevronRight,
  Check,
  GraduationCap,
  Star,
  FileText,
  MessageCircle,
  UserCheck,
  ArrowUp,
  ArrowRight,
  ImageIcon,
  Target,
  Plus,
  ExternalLink,
} from "lucide-react";
import { getJobById } from "@/lib/data/jobs";
import type { JobDetail } from "@/lib/data/jobs";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import { MatchExplanationModal } from "@/components/jobs/match-explanation-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LINKAREER_ID_OFFSET } from "@/lib/data/linkareer";

const ANALYZE_CACHE_KEY_PREFIX = "careermap-job-analyze-";

function readAnalyzeCache(activityId: string): AnalyzedSection[] | null {
  if (typeof window === "undefined" || !activityId) return null;
  try {
    const raw = localStorage.getItem(`${ANALYZE_CACHE_KEY_PREFIX}${activityId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { sections?: AnalyzedSection[] };
    if (Array.isArray(parsed?.sections) && parsed.sections.length > 0) return parsed.sections;
  } catch {
    /* ignore */
  }
  return null;
}

/** 커피챗 프로필 목업 (API 결과 없을 때 폴백) */
const COFFEECHAT_MENTORS = [
  { name: "이지연 (Sophia Lee)", badge: "RECRUITER", role: "Vinsign 디자인/프로덕트 채용 총괄", bio: "채용 프로세스 및 처우 관련 문의", initial: "S", color: "bg-emerald-100 text-emerald-700", image: "/assets/coffeechat/mentor-sophia.png" },
  { name: "박준서 (James Park)", badge: "DESIGN LEAD", role: "Vinsign 프로덕트 디자인 팀 리드", bio: "디자인 시스템 및 팀 문화 관련 문의", initial: "J", color: "bg-blue-100 text-blue-700", image: "/assets/coffeechat/mentor-james.png" },
  { name: "김다희 (Chloe Kim)", badge: "SENIOR DESIGNER", role: "Vinsign 시니어 프로덕트 디자이너", bio: "실무 프로세스 및 협업 방식 관련 문의", initial: "C", color: "bg-orange-100 text-orange-700", image: "/assets/coffeechat/mentor-chloe.png" },
] as const;

/** LinkedIn 검색 결과 (onewave searchService /api/coffee-chat와 동일 구조) */
interface CoffeeChatResult {
  name_and_title: string;
  profile_url: string;
  snippet: string;
  profile_image_url?: string;
  suggested_questions?: string[];
}

interface CoffeeChatApiResponse {
  status: "success" | "empty";
  query?: string;
  message?: string;
  results?: CoffeeChatResult[];
}

function MentorAvatar({
  mentor,
  initial,
  imageUrl,
  alt,
}: {
  mentor?: (typeof COFFEECHAT_MENTORS)[number];
  initial?: string;
  imageUrl?: string;
  alt?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const useMentorImage = mentor?.image && !imgFailed;
  const useUrlImage = imageUrl && !imgFailed;
  const useImage = useMentorImage && mentor ? mentor.image : useUrlImage ? imageUrl : null;
  const letter = initial ?? mentor?.initial ?? "?";
  const bgColor = mentor?.color ?? "bg-slate-100 text-slate-600";
  return (
    <div className={`relative w-20 h-20 min-w-20 min-h-20 rounded-4xl overflow-hidden shrink-0 flex items-center justify-center ${useImage ? "bg-slate-100" : bgColor}`}>
      {useMentorImage && mentor ? (
        <img src={mentor.image} alt={mentor.name} className="absolute inset-0 w-full h-full object-cover object-center block" onError={() => setImgFailed(true)} />
      ) : useUrlImage && imageUrl ? (
        <img src={imageUrl} alt={alt ?? ""} className="absolute inset-0 w-full h-full object-cover object-center block" onError={() => setImgFailed(true)} />
      ) : (
        <span className="text-3xl font-bold">{letter}</span>
      )}
    </div>
  );
}

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/** Build 2 personalized fallback questions from contact name/title and snippet when API returns empty. */
function getPersonalizedFallbackQuestions(contact: { name_and_title?: string; snippet?: string }): string[] {
  const title = (contact.name_and_title ?? "").trim();
  const snippet = (contact.snippet ?? "").trim();
  const rolePart = title.includes(" - ") ? title.split(" - ").pop()?.trim() || title : title;
  const snippetLead = snippet.split(/[·….]/)[0]?.trim().slice(0, 40) || "";
  const roleHint = rolePart || snippetLead || "현직자";
  return [
    `${roleHint} 관점에서 일상 업무나 팀 문화를 여쭤보세요.`,
    "이 직무에서 중요하게 보는 역량과 커리어 조언을 들을 수 있을까요?",
  ];
}

/** Coffee chat tab: onewave searchService 연동. companyName + position 있으면 API 호출 후 LinkedIn 결과 표시, 없거나 실패 시 목업 표시 */
function CoffeeChatSection({
  companyName,
  position,
  techStack = [],
}: {
  companyName?: string;
  position?: string;
  techStack?: string[];
}) {
  const [apiState, setApiState] = useState<{
    loading: boolean;
    data: CoffeeChatApiResponse | null;
    error: string | null;
  }>({ loading: false, data: null, error: null });
  const [suggestions, setSuggestions] = useState<string[][]>([]);

  const shouldFetch = Boolean(companyName?.trim() && position?.trim());

  // 정제: [회사명] 같은 괄호 제거, 직무에서 회사명 중복 제거
  const sanitizeForSearch = (value: string, stripBrackets = true) => {
    let s = value.trim();
    if (stripBrackets) s = s.replace(/\s*\[[^\]]*\]\s*/g, " ").trim();
    return s.replace(/\s+/g, " ").trim();
  };
  const cleanCompany = shouldFetch ? sanitizeForSearch(companyName!) : "";
  const cleanPosition = shouldFetch ? sanitizeForSearch(position!) : "";

  useEffect(() => {
    if (!shouldFetch || !cleanCompany || !cleanPosition) {
      setApiState({ loading: false, data: null, error: null });
      return;
    }
    setApiState((s) => ({ ...s, loading: true, error: null }));
    fetch("/api/coffee-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_name: cleanCompany,
        position: cleanPosition,
        tech_stack: Array.isArray(techStack) ? techStack.slice(0, 5) : [],
      }),
    })
      .then(async (res) => {
        const json = (await res.json()) as CoffeeChatApiResponse & { error?: string };
        if (!res.ok) {
          setApiState({ loading: false, data: null, error: json?.error ?? "검색 요청에 실패했어요" });
          return;
        }
        setApiState({
          loading: false,
          data: {
            status: json.status ?? "empty",
            query: json.query,
            message: json.message,
            results: json.results ?? [],
          },
          error: null,
        });
      })
      .catch(() => {
        setApiState({ loading: false, data: null, error: "검색 중 오류가 났어요" });
      });
  }, [cleanCompany, cleanPosition, shouldFetch]);

  const useApiResults = shouldFetch && !apiState.loading && apiState.data?.status === "success" && (apiState.data.results?.length ?? 0) > 0;
  const results = useApiResults ? apiState.data!.results! : [];
  const resultsLength = apiState.data?.results?.length ?? 0;
  const resultsQuery = apiState.data?.query ?? "";

  useEffect(() => {
    if (!useApiResults || resultsLength === 0 || !cleanCompany || !cleanPosition) {
      setSuggestions([]);
      return;
    }
    const contacts = apiState.data!.results!;
    setSuggestions([]);
    fetch("/api/coffee-chat/suggest-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_name: cleanCompany,
        position: cleanPosition,
        contacts: contacts.map((r) => ({
          name_and_title: r.name_and_title,
          snippet: r.snippet,
        })),
      }),
    })
      .then(async (res) => {
        const json = (await res.json()) as { suggestions?: string[][] };
        if (res.ok && Array.isArray(json.suggestions)) {
          setSuggestions(json.suggestions);
        }
      })
      .catch(() => {});
  }, [useApiResults, cleanCompany, cleanPosition, resultsLength, resultsQuery]);

  const showMock = !useApiResults;

  return (
    <div className="min-h-[400px] space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">현직자 커피챗</h3>
        <p className="text-sm text-slate-500 mt-1">
          {shouldFetch
            ? "이 회사·직무에 맞는 LinkedIn 현직자 프로필을 검색했어요."
            : "이 회사에 재직 중인 현직자에게 궁금한 점을 물어보세요."}
        </p>
      </div>

      {apiState.loading && (
        <div className="py-12 text-center rounded-3xl border border-slate-100 bg-white">
          <p className="text-slate-500">LinkedIn 현직자 검색 중...</p>
          <div className="mt-3 flex justify-center gap-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#2463E9]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#2463E9] [animation-delay:0.2s]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#2463E9] [animation-delay:0.4s]" />
          </div>
        </div>
      )}

      {apiState.error && (
        <p className="text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-2">
          {apiState.error} 아래 샘플 프로필을 참고해 보세요.
        </p>
      )}

      {useApiResults && (
        <div className="space-y-4">
          {results.map((contact, i) => {
            const nameAndTitle = contact.name_and_title ?? "";
            const initial = nameAndTitle.trim().charAt(0) || "?";
            const questionList = suggestions[i];
            const hasSuggestions = Array.isArray(questionList) && questionList.length > 0;
            const displayQuestions = hasSuggestions ? questionList : getPersonalizedFallbackQuestions(contact);
            return (
              <div
                key={`${contact.profile_url}-${i}`}
                className="flex flex-col gap-6 p-6 rounded-3xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative w-20 h-20 shrink-0">
                    <MentorAvatar
                      initial={initial}
                      imageUrl={contact.profile_image_url}
                      alt={nameAndTitle || "LinkedIn 프로필"}
                    />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0077B5] flex items-center justify-center text-white border-2 border-white pointer-events-none">
                      <LinkedInIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xl font-bold text-slate-900">{nameAndTitle || "LinkedIn 프로필"}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">{contact.snippet || "—"}</p>
                  </div>
                  <a
                    href={contact.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white px-6 h-12 font-semibold transition-colors"
                  >
                    <LinkedInIcon className="mr-2" />
                    프로필 확인하기
                  </a>
                </div>
                {displayQuestions.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">이런 점 물어보기</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                      {displayQuestions.map((q, j) => (
                        <li key={j}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showMock && !apiState.loading && (
        <div className="space-y-4">
          {COFFEECHAT_MENTORS.map((mentor, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="relative w-20 h-20 shrink-0">
                <MentorAvatar mentor={mentor} />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0077B5] flex items-center justify-center text-white border-2 border-white pointer-events-none">
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xl font-bold text-slate-900">{mentor.name}</h4>
                  <span className="px-2.5 py-1 rounded-md bg-white text-slate-700 text-[10px] font-bold uppercase tracking-wide border border-slate-200">
                    {mentor.badge}
                  </span>
                </div>
                <p className="text-base text-slate-600 font-medium">{mentor.role}</p>
                <p className="text-sm text-slate-500">{mentor.bio}</p>
              </div>
              <Button className="shrink-0 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white px-6 h-12" size="lg" disabled>
                <LinkedInIcon className="mr-2" />
                프로필 확인하기
              </Button>
            </div>
          ))}
          {shouldFetch && apiState.data?.status === "empty" && (
            <p className="text-sm text-slate-500">이 회사·직무로 검색된 LinkedIn 프로필이 없어 샘플을 보여드려요.</p>
          )}
        </div>
      )}
    </div>
  );
}

/** D-day from deadline string (YYYY-MM-DD) */
function getDDay(deadlineStr: string | undefined): string | null {
  if (!deadlineStr) return null;
  const end = new Date(deadlineStr);
  end.setHours(23, 59, 59, 999);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "마감";
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) return "—";
  const s = start ? new Date(start).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, "") : "";
  const e = end ? new Date(end).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, "") : "";
  return [s, e].filter(Boolean).join(" ~ ") || "—";
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
    hiringOrganization?: { name?: string; logo?: string; sameAs?: string };
    image?: { contentUrl?: string };
  };
  detailImageUrl?: string | null;
  companyType?: string;
  recruitCategory?: string;
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

/** Analyzed section from analyze API */
interface AnalyzedSection {
  title: string;
  content: string;
}

// ----- Shared layout: SNOW-style job detail -----
function JobDetailLayout({
  breadcrumb,
  badgeLabel,
  dDay,
  title,
  companyName,
  location,
  logoEl,
  leftContent,
  applyCard,
  companyCard,
  topActions,
}: {
  breadcrumb: React.ReactNode;
  badgeLabel: string;
  dDay: string | null;
  title: string;
  companyName: string;
  location: string;
  logoEl: React.ReactNode;
  leftContent: React.ReactNode;
  applyCard: React.ReactNode;
  companyCard: React.ReactNode;
  topActions: React.ReactNode;
}) {
  const mainRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    mainRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] overflow-clip">
      <main ref={mainRef} className="max-w-[1200px] mx-auto pt-12 pb-24 px-6 md:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          {breadcrumb}
        </nav>

        {/* Hero */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#2463E9]/10 text-[#2463E9] text-[13px] font-bold rounded-md">
                  {badgeLabel}
                </span>
                {dDay && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[13px] font-medium rounded-md">
                    {dDay}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-[40px] font-extrabold text-slate-900 leading-tight mb-4">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-base text-slate-500">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-300 shrink-0" />
                  <span className="font-semibold text-slate-700">{companyName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-2 shrink-0 overflow-hidden">
              {logoEl}
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8 space-y-12 md:space-y-16">
            {leftContent}
          </div>
          <aside className="lg:col-span-4 lg:sticky lg:top-[100px] space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl shadow-slate-200/40">
              {applyCard}
            </div>
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
              {companyCard}
            </div>
          </aside>
        </div>
      </main>

      {topActions}

      <div className="fixed bottom-10 right-6 md:right-10 flex flex-col gap-3 z-40">
        <button
          type="button"
          onClick={scrollToTop}
          className="w-14 h-14 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
          aria-label="맨 위로"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <a
          href="/dashboard"
          className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="문의"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

// ----- Local job (JobDetail) view -----
function getBadgeLabel(badge: string): string {
  switch (badge) {
    case "apply": return "적정 지원";
    case "prep": return "준비 필요";
    case "stretch": return "지원 위험";
    default: return "채용";
  }
}

function LocalJobDetailView({ job, isSaved, onToggleSaved }: { job: JobDetail; isSaved: boolean; onToggleSaved: () => void }) {
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const dDay = getDDay(job.deadline);
  const postedAt = job.postedAt ?? "";
  const deadline = job.deadline ?? "";

  const breadcrumb = (
    <>
      <Link href="/jobs" className="hover:text-slate-600 transition-colors">채용홈</Link>
      <ChevronRight className="w-3 h-3 text-slate-300" />
      <span className="text-slate-900 font-medium">상세 공고</span>
    </>
  );

  const logoEl = job.logoUrl ? (
    <img src={job.logoUrl} alt="" className="w-full h-full object-contain" />
  ) : (
    <span className="text-2xl font-bold text-slate-700">{typeof job.logo === "string" ? job.logo : job.company.charAt(0)}</span>
  );

  const leftContent = (
    <Tabs defaultValue="intro" className="w-full">
      <TabsList className="w-full grid grid-cols-2 rounded-xl bg-slate-100 p-1 h-auto mb-8 max-w-md">
        <TabsTrigger value="intro" className="rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
          상세 정보
        </TabsTrigger>
        <TabsTrigger value="coffee" className="rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
          커피챗
        </TabsTrigger>
      </TabsList>
      <TabsContent value="intro" className="mt-0 space-y-12 md:space-y-16">
      {/* 부서/회사 소개 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[#2463E9] rounded-full" />
          <h2 className="text-xl md:text-[22px] font-bold text-slate-900">부서 소개</h2>
        </div>
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <p className="text-[15px] md:text-[17px] leading-[1.8] text-slate-600 whitespace-pre-line">
            {job.description || "소개 내용이 없습니다."}
          </p>
        </div>
      </section>

      {/* 직무 개요 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[#2463E9] rounded-full" />
          <h2 className="text-xl md:text-[22px] font-bold text-slate-900">직무 개요</h2>
        </div>
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <ul className="space-y-6">
            {job.responsibilities.map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5 text-[#2463E9]" />
                </div>
                <span className="text-[15px] md:text-[17px] text-slate-600 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 필요 역량 & 우대 사항 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#2463E9]" />
            필요 역량
          </h3>
          <ul className="space-y-4">
            {job.requirements.map((item, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-slate-600">
                <span className="text-slate-300">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            우대 사항
          </h3>
          <ul className="space-y-4">
            {job.preferred.map((item, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-slate-600">
                <span className="text-slate-300">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 전형 절차 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[#2463E9] rounded-full" />
          <h2 className="text-xl md:text-[22px] font-bold text-slate-900">전형 절차</h2>
        </div>
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative">
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-slate-100 -translate-y-1/2 hidden sm:block -z-10" />
          {[
            { icon: FileText, label: "서류 전형", sub: "이력서 및 포트폴리오", active: true },
            { icon: MessageCircle, label: "인터뷰", sub: "실무진 면접 (1회)", active: false },
            { icon: UserCheck, label: "최종 합격", sub: "처우 협의 및 입사", active: false },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-4 bg-white px-4 z-10">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl ${step.active ? "bg-[#2463E9] text-white shadow-lg shadow-blue-100" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>
                <step.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="text-center">
                <p className="text-[15px] md:text-[16px] font-bold text-slate-900">{step.label}</p>
                <p className="text-xs md:text-[13px] text-slate-400 mt-1">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 참고 및 유의사항 */}
      <section className="pt-8 border-t border-slate-200">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">참고 및 유의사항</h3>
        <p className="text-[14px] leading-relaxed text-slate-500">
          • 채용 공고 내용은 회사 사정에 따라 변경될 수 있습니다. 지원 전 해당 기업 채용 페이지를 확인해 주세요.
        </p>
      </section>
      </TabsContent>
      <TabsContent value="coffee" className="mt-0">
        <CoffeeChatSection companyName={job.company} position={job.title} techStack={job.matchedSkills ?? []} />
      </TabsContent>
    </Tabs>
  );

  const applyCard = (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[15px] text-slate-500">접수 마감</span>
          <span className="text-[15px] font-bold text-red-500">{dDay ?? "—"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[15px] text-slate-500">접수 기간</span>
          <span className="text-[15px] font-bold text-slate-900">{formatDateRange(postedAt, deadline)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[15px] text-slate-500">근무 형태</span>
          <span className="text-[15px] font-bold text-slate-900">{job.type}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[15px] text-slate-500">경력</span>
          <span className="text-[15px] font-bold text-slate-900">{job.experience}</span>
        </div>
      </div>
      <div className="h-px bg-slate-100" />
      <div className="space-y-3">
        <Button asChild className="w-full h-[60px] bg-[#2463E9] hover:bg-[#1d4fd7] text-white rounded-2xl font-bold text-lg transition-all">
          <Link href={`/prepare/skills?job=${job.id}`} className="flex items-center justify-center gap-2">
            이 채용 준비하기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full h-[60px] border-slate-200 text-slate-700 rounded-2xl font-bold text-base hover:bg-slate-50">
          <Link href="/track" className="flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            지원 현황에 추가
          </Link>
        </Button>
      </div>
    </div>
  );

  const companyCard = (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center">
          {job.logoUrl ? (
            <img src={job.logoUrl} alt="" className="w-full h-full object-contain" />
          ) : (
            <span className="text-lg font-bold text-slate-600">{job.company.charAt(0)}</span>
          )}
        </div>
        <div>
          <p className="text-[16px] font-bold text-slate-900">{job.company}</p>
          <p className="text-[13px] text-slate-500">{job.industry} · {job.type}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <p className="text-[12px] text-slate-400 mb-1">근무지</p>
          <p className="text-[14px] font-bold text-slate-700 truncate" title={job.location}>{job.location}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <p className="text-[12px] text-slate-400 mb-1">연봉</p>
          <p className="text-[14px] font-bold text-slate-700 truncate" title={job.salary}>{job.salary}</p>
        </div>
      </div>
      <Button asChild variant="outline" className="w-full py-3 text-[14px] font-bold text-[#2463E9] border-blue-100 bg-blue-50/50 rounded-xl hover:bg-blue-50">
        <Link href="/jobs">다른 채용 보기</Link>
      </Button>
    </>
  );

  const topActions = (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 z-30">
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        aria-label="공유"
      >
        <Share2 className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={onToggleSaved}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isSaved ? "text-[#2463E9] bg-blue-50" : "hover:bg-slate-100 text-slate-600"}`}
        aria-label="저장"
      >
        <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
      </button>
    </div>
  );

  return (
    <>
      <JobDetailLayout
        breadcrumb={breadcrumb}
        badgeLabel={getBadgeLabel(job.badge)}
        dDay={dDay}
        title={job.title}
        companyName={job.company}
        location={job.location}
        logoEl={logoEl}
        leftContent={leftContent}
        applyCard={applyCard}
        companyCard={companyCard}
        topActions={topActions}
      />
      <MatchExplanationModal open={matchModalOpen} onOpenChange={setMatchModalOpen} job={job} />
    </>
  );
}

// ----- Linkareer job view (SNOW-style) -----
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
  const homepageUrl = org?.sameAs?.trim() || null;
  const location = formatLocation(jp.jobLocation);
  const validThrough = jp.validThrough;
  const dDay = validThrough ? getDDay(validThrough.split("T")[0]) : null;

  const [analyzedSections, setAnalyzedSections] = useState<AnalyzedSection[] | null>(() =>
    readAnalyzeCache(activityId)
  );
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const [textAnalyzedSections, setTextAnalyzedSections] = useState<AnalyzedSection[] | null>(null);
  const [textAnalyzeLoading, setTextAnalyzeLoading] = useState(false);
  const [textAnalyzeError, setTextAnalyzeError] = useState<string | null>(null);

  const fetchAnalyze = () => {
    if (!activityId) return;
    setAnalyzeLoading(true);
    setAnalyzeError(null);
    fetch(`/api/linkareer/activity/${activityId}/analyze`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({})) as { error?: string; details?: string };
        if (!res.ok) {
          const msg = data?.error ?? data?.details ?? "분석을 불러올 수 없어요";
          throw new Error(typeof msg === "string" ? msg : "분석을 불러올 수 없어요");
        }
        return data as { sections?: AnalyzedSection[] };
      })
      .then((data) => {
        const list = data.sections ?? [];
        setAnalyzedSections(Array.isArray(list) ? list : []);
        try {
          localStorage.setItem(`${ANALYZE_CACHE_KEY_PREFIX}${activityId}`, JSON.stringify({ sections: list, fetchedAt: Date.now() }));
        } catch { /* ignore */ }
      })
      .catch((e: Error) => { setAnalyzeError(e.message); setAnalyzedSections(null); })
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
        const list = Array.isArray(data.sections) ? data.sections : [];
        setTextAnalyzedSections(list);
        if (activityId && list.length > 0) {
          try {
            localStorage.setItem(
              `${ANALYZE_CACHE_KEY_PREFIX}${activityId}`,
              JSON.stringify({ sections: list, fetchedAt: Date.now() })
            );
          } catch {
            /* ignore */
          }
        }
      })
      .catch((e: Error) => {
        setTextAnalyzeError(e.message);
        setTextAnalyzedSections(null);
      })
      .finally(() => setTextAnalyzeLoading(false));
  };

  useEffect(() => {
    if (!activityId) return;
    const cached = readAnalyzeCache(activityId);
    if (cached?.length) {
      setAnalyzedSections(cached);
      return;
    }
    fetchAnalyze();
  }, [activityId]);

  const sectionsToShow = (analyzedSections?.length ? analyzedSections : null) ?? (textAnalyzedSections?.length ? textAnalyzedSections : null);
  const isLoading = analyzeLoading || textAnalyzeLoading || (!sectionsToShow && (jp.description?.trim() || detail.detailImageUrl));

  const breadcrumb = (
    <>
      <Link href="/jobs" className="hover:text-slate-600 transition-colors">채용홈</Link>
      <ChevronRight className="w-3 h-3 text-slate-300" />
      <span className="text-slate-400">서비스 & 비즈니스</span>
      <ChevronRight className="w-3 h-3 text-slate-300" />
      <span className="text-slate-900 font-medium">상세 공고</span>
    </>
  );

  const logoEl = logoUrl ? (
    <img src={logoUrl} alt="" className="w-full h-full object-contain" />
  ) : (
    <span className="text-2xl font-bold text-slate-700">{(org?.name ?? "L").charAt(0)}</span>
  );

  const leftContent = (
    <Tabs defaultValue="intro" className="w-full">
      <TabsList className="w-full grid grid-cols-2 rounded-xl bg-slate-100 p-1 h-auto mb-8 max-w-md">
        <TabsTrigger value="intro" className="rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
          상세 정보
        </TabsTrigger>
        <TabsTrigger value="coffee" className="rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
          커피챗
        </TabsTrigger>
      </TabsList>
      <TabsContent value="intro" className="mt-0">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[#2463E9] rounded-full" />
          <h2 className="text-xl md:text-[22px] font-bold text-slate-900">부서 소개</h2>
        </div>
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          {isLoading && !sectionsToShow && (
            <div className="py-12 text-center">
              <p className="text-slate-500">AI가 공고를 정리하고 있어요…</p>
              <div className="mt-3 flex justify-center gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#2463E9]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#2463E9] [animation-delay:0.2s]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#2463E9] [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          {!detail.detailImageUrl && jp.description?.trim() && !sectionsToShow && !textAnalyzeLoading && (
            <>
              <p className="text-[15px] md:text-[17px] leading-[1.8] text-slate-600 whitespace-pre-line">{jp.description}</p>
              <Button onClick={fetchTextAnalyze} disabled={textAnalyzeLoading} className="mt-4">
                {textAnalyzeLoading ? "분석 중…" : "AI로 정리하기"}
              </Button>
              {textAnalyzeError && <p className="text-sm text-red-500 mt-2">{textAnalyzeError}</p>}
            </>
          )}
          {sectionsToShow && sectionsToShow.length > 0 && !showOriginalImage && (
            <>
              {sectionsToShow.map((section, i) => (
                <div key={i} className={i > 0 ? "mt-6 pt-6 border-t border-slate-100" : ""}>
                  <h3 className="font-bold text-slate-900 mb-2">{section.title}</h3>
                  <p className="text-slate-600 whitespace-pre-line leading-relaxed text-[15px]">{section.content}</p>
                </div>
              ))}
              {detail.detailImageUrl && (
                <button
                  type="button"
                  onClick={() => setShowOriginalImage(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200"
                >
                  <ImageIcon className="w-4 h-4" />
                  원본 이미지 보기
                </button>
              )}
            </>
          )}
          {showOriginalImage && detail.detailImageUrl && (
            <div className="space-y-3">
              <img src={detail.detailImageUrl} alt="" className="max-w-full w-full rounded-lg" />
              <button type="button" onClick={() => setShowOriginalImage(false)} className="text-sm text-[#2463E9] hover:underline">
                구조화된 보기로 돌아가기
              </button>
            </div>
          )}
          {!analyzeLoading && !analyzedSections?.length && analyzeError && (
            <p className="text-sm text-red-500">{analyzeError}</p>
          )}
        </div>
      </section>

      <section className="pt-8 border-t border-slate-200">
        <h3 className="text-[15px] font-bold text-slate-900 mb-4">참고 및 유의사항</h3>
        <p className="text-[14px] leading-relaxed text-slate-500">
          • 채용 공고 내용은 회사 사정에 따라 변경될 수 있습니다. 지원 전 링커리어 또는 해당 기업 채용 페이지를 확인해 주세요.
        </p>
      </section>
      </TabsContent>
      <TabsContent value="coffee" className="mt-0">
        <CoffeeChatSection companyName={org?.name} position={jp.title ?? undefined} />
      </TabsContent>
    </Tabs>
  );

  const applyCard = (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[15px] text-slate-500">접수 마감</span>
          <span className="text-[15px] font-bold text-red-500">{dDay ?? "—"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[15px] text-slate-500">접수 기간</span>
          <span className="text-[15px] font-bold text-slate-900">{formatDateRange(jp.datePosted, validThrough)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[15px] text-slate-500">근무 형태</span>
          <span className="text-[15px] font-bold text-slate-900">{formatEmploymentType(jp.employmentType)}</span>
        </div>
      </div>
      <div className="h-px bg-slate-100" />
      <div className="space-y-3">
        <Button asChild className="w-full h-[60px] bg-[#2463E9] hover:bg-[#1d4fd7] text-white rounded-2xl font-bold text-lg transition-all">
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
            지원하기
            <ArrowRight className="w-4 h-4" />
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full h-[60px] border-slate-200 text-slate-700 rounded-2xl font-bold text-base hover:bg-slate-50">
          <a href={homepageUrl ?? sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
            <ExternalLink className="w-5 h-5" />
            {homepageUrl ? "홈페이지" : "링커리어에서 지원하기"}
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full h-[60px] border-slate-200 text-slate-700 rounded-2xl font-bold text-base hover:bg-slate-50">
          <Link href={`/prepare/skills?job=${jobIdNum}`} className="flex items-center justify-center gap-2">
            <Target className="w-5 h-5" />
            이 채용 준비하기
          </Link>
        </Button>
      </div>
    </div>
  );

  const companyCard = (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center">
          {logoUrl ? <img src={logoUrl} alt="" className="w-full h-full object-contain" /> : <span className="text-lg font-bold text-slate-600">{(org?.name ?? "—").charAt(0)}</span>}
        </div>
        <div>
          <p className="text-[16px] font-bold text-slate-900">{org?.name ?? "—"}</p>
          <p className="text-[13px] text-slate-500">IT · 플랫폼</p>
        </div>
      </div>
      <Button asChild variant="outline" className="w-full py-3 text-[14px] font-bold text-[#2463E9] border-blue-100 bg-blue-50/50 rounded-xl hover:bg-blue-50">
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer">기업 상세 정보 보기</a>
      </Button>
    </>
  );

  const topActions = (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 z-30">
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        aria-label="링커리어에서 보기"
      >
        <Share2 className="w-5 h-5" />
      </a>
      <button
        type="button"
        onClick={onToggleSaved}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isSaved ? "text-[#2463E9] bg-blue-50" : "hover:bg-slate-100 text-slate-600"}`}
        aria-label="저장"
      >
        <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
      </button>
    </div>
  );

  const employmentLabel = formatEmploymentType(jp.employmentType);
  const badgeLabel = employmentLabel !== "—" ? employmentLabel : "채용";

  return (
    <JobDetailLayout
      breadcrumb={breadcrumb}
      badgeLabel={badgeLabel}
      dDay={dDay}
      title={jp.title ?? "—"}
      companyName={org?.name ?? "—"}
      location={location}
      logoEl={logoEl}
      leftContent={leftContent}
      applyCard={applyCard}
      companyCard={companyCard}
      topActions={topActions}
    />
  );
}

// ----- Page entry -----
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

  if (isLinkareer) {
    if (linkareerLoading) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-[#F8FAFC]">
          <div className="text-center">
            <p className="text-slate-500">채용 정보를 불러오는 중...</p>
            <div className="mt-3 flex justify-center gap-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2463E9]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2463E9] [animation-delay:0.2s]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2463E9] [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      );
    }
    if (linkareerError || !linkareerDetail) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-[#F8FAFC] text-center px-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">채용 정보를 찾을 수 없어요</h2>
            <p className="text-slate-500 mb-4">{linkareerError ?? "해당 채용이 삭제되었거나 존재하지 않습니다."}</p>
            <Button asChild variant="outline">
              <Link href="/jobs">채용 목록으로</Link>
            </Button>
          </div>
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
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F8FAFC] text-center px-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">채용 정보를 찾을 수 없어요</h2>
          <p className="text-slate-500 mb-4">해당 채용이 삭제되었거나 존재하지 않습니다.</p>
          <Button asChild variant="outline">
            <Link href="/jobs">채용 목록으로</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <LocalJobDetailView job={job} isSaved={isSaved(job.id)} onToggleSaved={() => toggleSaved(job.id)} />;
}
