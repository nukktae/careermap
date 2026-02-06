"use client";

import { useState, Suspense, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Target, FileText, FileDown, Link2, Printer } from "lucide-react";
import { getJobs, getJobById } from "@/lib/data/jobs";
import { LINKAREER_ID_OFFSET } from "@/lib/data/linkareer";
import {
  getCoverLetterPrompts,
  getCoverLetterGuidance,
} from "@/lib/data/prepare";
import {
  getSelfIntroductionOrderedEntries,
} from "@/lib/data/selfintroduction";
import {
  JobBanner,
  CoverLetterPreviewCard,
} from "@/components/prepare/preview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Paths to cover letter documents in public folder. Place PDF/DOCX in `public/docs/`. */
const COVER_LETTER_DOCS = {
  pdf: "/docs/자기소개서 아노.pdf",
  docx: "/docs/자기소개서 아노.docx",
} as const;

function useJobContext(jobId: number | null) {
  const [linkareerLabel, setLinkareerLabel] = useState<{
    company: string;
    title: string;
    logoUrl?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const isLinkareer =
    jobId != null && !Number.isNaN(jobId) && jobId >= LINKAREER_ID_OFFSET;
  const activityId =
    jobId != null && isLinkareer ? String(jobId - LINKAREER_ID_OFFSET) : "";
  const localJob = jobId != null && !isLinkareer ? getJobById(jobId) : undefined;

  useEffect(() => {
    if (!isLinkareer || !activityId) return;
    let cancelled = false;
    setLoading(true);
    setLinkareerLabel(null);
    fetch(`/api/linkareer/activity/${activityId}`)
      .then((r) =>
        r.ok
          ? (r.json() as Promise<{
              jobPosting?: {
                title?: string;
                hiringOrganization?: { name?: string; logo?: string };
              };
            }>)
          : null
      )
      .then((data) => {
        if (cancelled) return;
        const company =
          data?.jobPosting?.hiringOrganization?.name ?? "해당 회사";
        const title = data?.jobPosting?.title ?? `채용 #${jobId}`;
        const logoUrl = data?.jobPosting?.hiringOrganization?.logo;
        setLinkareerLabel({ company, title, logoUrl });
      })
      .catch(() => {
        if (!cancelled)
          setLinkareerLabel({
            company: "Linkareer",
            title: `채용 #${activityId}`,
          });
      })
      .finally(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [activityId, isLinkareer, jobId]);

  if (jobId == null || Number.isNaN(jobId))
    return { company: null, title: null, logoUrl: null, loading: false };
  if (localJob)
    return {
      company: localJob.company,
      title: localJob.title,
      logoUrl: localJob.logoUrl ?? null,
      loading: false,
    };
  if (loading)
    return { company: null, title: null, logoUrl: null, loading: true };
  if (linkareerLabel)
    return {
      company: linkareerLabel.company,
      title: linkareerLabel.title,
      logoUrl: linkareerLabel.logoUrl ?? null,
      loading: false,
    };
  return {
    company: "선택한 채용",
    title: `채용 #${jobId}`,
    logoUrl: null,
    loading: false,
  };
}

function PrepareCoverLetterContent() {
  const searchParams = useSearchParams();
  const jobs = getJobs();
  const jobParam = searchParams.get("job");
  const urlJobId = jobParam ? parseInt(jobParam, 10) : null;
  const validJobId =
    jobParam != null && urlJobId != null && !Number.isNaN(urlJobId)
      ? urlJobId
      : null;
  const jobContext = useJobContext(validJobId);
  const prompts = getCoverLetterPrompts();
  const initialCompanyId =
    urlJobId != null &&
    !Number.isNaN(urlJobId) &&
    jobs.some((j) => j.id === urlJobId)
      ? String(urlJobId)
      : String(jobs[0]?.id ?? "1");
  const [companyId, setCompanyId] = useState<string>(initialCompanyId);
  const [promptId, setPromptId] = useState<string>(prompts[0]?.id ?? "motivation");
  const [customPrompt, setCustomPrompt] = useState("");
  const numId = companyId ? parseInt(companyId, 10) : 1;
  const guidance = getCoverLetterGuidance(Number.isNaN(numId) ? 1 : numId);

  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    let cancelled = false;
    setPdfAvailable(null);
    fetch(COVER_LETTER_DOCS.pdf, { method: "HEAD" })
      .then((r) => !cancelled && setPdfAvailable(r.ok))
      .catch(() => !cancelled && setPdfAvailable(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const selfIntroEntries = getSelfIntroductionOrderedEntries();

  const handleShare = useCallback(() => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      window.alert("링크가 복사되었습니다.");
    }
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") window.print();
  }, []);

  if (!validJobId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            자소서 가이드
          </h1>
          <p className="text-slate-500">
            회사·질문별 구조, 강조할 경험, 샘플 문장 가이드를 받으세요. 위에서 저장한 채용을 선택하거나 아래에서 채용 찾기로 이동하세요.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <Target className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <p className="text-slate-500 mb-4">비교할 채용을 선택해 주세요</p>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center rounded-xl bg-[#2463E9] text-white font-bold px-5 py-2.5 text-sm hover:bg-blue-700 transition-colors"
          >
            채용 찾기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <JobBanner
        jobId={validJobId}
        company={jobContext.company ?? "회사"}
        title={jobContext.loading ? "불러오는 중…" : jobContext.title ?? "채용"}
        logoUrl={jobContext.logoUrl}
      />

      <div className="w-full bg-[#F1F5F9] rounded-b-2xl">
        <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">보기 설정</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      대상 회사
                    </p>
                    <Select value={companyId} onValueChange={setCompanyId}>
                      <SelectTrigger className="bg-slate-50 border-slate-200">
                        <SelectValue placeholder="회사 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.slice(0, 6).map((job) => (
                          <SelectItem key={job.id} value={String(job.id)}>
                            {job.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      자소서 질문
                    </p>
                    <Select value={promptId} onValueChange={setPromptId}>
                      <SelectTrigger className="bg-slate-50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {prompts.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {promptId === "custom" && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        직접 입력
                      </p>
                      <input
                        placeholder="질문을 입력하세요"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {guidance && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">가이드</h3>
                  <p className="text-xs text-slate-500 italic">
                    이것은 가이드일 뿐, 복사-붙여넣기 하지 마세요.
                  </p>
                  <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                    <h4 className="font-semibold text-slate-900 mb-2 text-sm">구조 추천</h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      <li><strong className="text-slate-800">서론:</strong> {guidance.structure.intro}</li>
                      <li><strong className="text-slate-800">본문:</strong> {guidance.structure.body}</li>
                      <li><strong className="text-slate-800">결론:</strong> {guidance.structure.conclusion}</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                    <h4 className="font-semibold text-slate-900 mb-2 text-sm">강조할 경험</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                      {guidance.experiencesToEmphasize.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                    <h4 className="font-semibold text-slate-900 mb-2 text-sm">회사 가치 정렬</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                      {guidance.valuesAlignment.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                    <h4 className="font-semibold text-slate-900 mb-2 text-sm">샘플 문장</h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {guidance.samplePhrases.map((s, i) => (
                        <li key={i}>
                          <span className="font-medium text-slate-800">{s.label}:</span> {s.phrase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </aside>

          <section className="lg:col-span-6 order-1 lg:order-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  자기소개서 미리보기
                </h2>
                <p className="text-sm text-slate-500">
                  자소서 내용을 확인하세요. PDF가 있으면 표시되고, 없으면 selfintroduction.json 기준으로 표시됩니다.
                </p>
              </div>
            </div>

            <div className="overflow-auto rounded-xl border border-slate-100 bg-slate-100/50 p-2 sm:p-4 max-h-[calc(100vh-11rem)] min-h-[420px]">
              {pdfAvailable === true && (
                <iframe
                  src={`${encodeURI(COVER_LETTER_DOCS.pdf)}#toolbar=1&navpanes=1`}
                  title="자기소개서 PDF 미리보기"
                  className="w-full border-0 rounded-lg bg-white min-h-[calc(100vh-12rem)]"
                />
              )}
              {pdfAvailable === false && (
                <div className="w-full">
                  <CoverLetterPreviewCard entries={selfIntroEntries} />
                </div>
              )}
              {pdfAvailable === null && (
                <div className="flex items-center justify-center min-h-[420px]">
                  <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
                </div>
              )}
            </div>
          </section>

          <aside className="lg:col-span-3 order-3">
            <aside className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24 z-10">
                <h3 className="text-lg font-bold text-slate-900 mb-6">파일 내보내기</h3>
                <div className="space-y-3">
                  <a
                    href={COVER_LETTER_DOCS.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-[#2463E9] hover:text-[#2463E9] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FileDown className="w-5 h-5 text-red-500 shrink-0" />
                      <span>PDF 다운로드</span>
                    </div>
                  </a>
                  <a
                    href={COVER_LETTER_DOCS.docx}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-[#2463E9] hover:text-[#2463E9] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-500 shrink-0" />
                      <span>DOCX 다운로드</span>
                    </div>
                  </a>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-[#2463E9] hover:text-[#2463E9] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Link2 className="w-5 h-5 text-blue-400 shrink-0" />
                      <span>공유 링크 복사</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-[#2463E9] hover:text-[#2463E9] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Printer className="w-5 h-5 text-slate-400 shrink-0" />
                      <span>인쇄하기</span>
                    </div>
                  </button>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <div className="bg-blue-50 p-4 rounded-xl mb-6">
                    <p className="text-xs text-[#2463E9] font-bold mb-1">Expert Advice</p>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      현재 버전은 {jobContext.company ?? "해당 채용"} 직무 키워드와 잘 매칭됩니다. 이대로 지원하시는 것을 권장합니다!
                    </p>
                  </div>
                  <Link
                    href={`/jobs/${validJobId}`}
                    className="block w-full py-4 bg-[#2463E9] text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-center text-sm"
                  >
                    이 버전으로 최종 지원
                  </Link>
                  <p className="text-center text-[10px] text-slate-400 mt-4">
                    지원 완료 후에는 수정이 불가능합니다.
                  </p>
                </div>
              </div>
            </aside>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default function PrepareCoverLetterPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
        </div>
      }
    >
      <PrepareCoverLetterContent />
    </Suspense>
  );
}
