"use client";

import { useState, useMemo, Suspense, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Target, ZoomIn, ZoomOut } from "lucide-react";
import { getJobById } from "@/lib/data/jobs";
import { LINKAREER_ID_OFFSET } from "@/lib/data/linkareer";
import {
  getResumeDisplayOriginal,
  getResumeDisplayOptimized,
} from "@/lib/data/resume-display";
import { fixedcvRaw } from "@/lib/data/fixedcv";
import {
  JobBanner,
  PreviewLeftSidebar,
  ResumePreviewCard,
  PreviewRightSidebar,
} from "@/components/prepare/preview";

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
  return { company: "선택한 채용", title: `채용 #${jobId}`, logoUrl: null, loading: false };
}

function PreparePreviewContent() {
  const searchParams = useSearchParams();
  const jobParam = searchParams.get("job");
  const urlJobId = jobParam ? parseInt(jobParam, 10) : null;
  const validJobId =
    jobParam != null && urlJobId != null && !Number.isNaN(urlJobId)
      ? urlJobId
      : null;

  const jobContext = useJobContext(validJobId);

  const [version, setVersion] = useState<"original" | "optimized">("optimized");
  const [zoom, setZoom] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const displayData = useMemo(
    () => (version === "original" ? getResumeDisplayOriginal() : getResumeDisplayOptimized()),
    [version]
  );

  const handleDownloadPdf = useCallback(async () => {
    if (typeof window === "undefined") return;
    setPdfError(null);
    setPdfLoading(true);
    try {
      const renderer = await import("@react-pdf/renderer");
      const { CvPdfDocument } = await import("@/components/prepare/CvPdfDocument");
      const blob = await renderer
        .pdf(<CvPdfDocument data={fixedcvRaw} />)
        .toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CV.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "PDF 생성에 실패했어요.";
      setPdfError(message);
      console.error("PDF download error:", e);
    } finally {
      setPdfLoading(false);
    }
  }, []);

  const handleShare = useCallback(() => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      window.alert("링크가 복사되었습니다.");
    }
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") window.print();
  }, []);

  // No job selected: show empty state
  if (!validJobId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            이력서 미리보기
          </h1>
          <p className="text-slate-500">
            원본과 최적화 버전을 비교하고 PDF로 내려받으세요. 위에서 저장한 채용을
            선택하거나 아래에서 채용 찾기로 이동하세요.
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
      {/* Job banner with prep sub-tabs (only on preview page when job selected) */}
      <JobBanner
        jobId={validJobId}
        company={jobContext.company ?? "회사"}
        title={jobContext.loading ? "불러오는 중…" : jobContext.title ?? "채용"}
        logoUrl={jobContext.logoUrl}
      />

      {/* Main 3-column layout */}
      <div className="w-full bg-[#F1F5F9] rounded-b-2xl">
        <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <aside className="lg:col-span-3 order-2 lg:order-1">
          <PreviewLeftSidebar
            version={version}
            onVersionChange={setVersion}
            jdFitScore={92}
          />
        </aside>

        <section className="lg:col-span-6 order-1 lg:order-2">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                이력서 미리보기
              </h2>
              <p className="text-sm text-slate-500">
                A4 규격에 최적화된 레이아웃입니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                aria-label="확대"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                aria-label="축소"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-auto rounded-xl border border-slate-100 bg-slate-100/50 p-2 sm:p-4 max-h-[calc(100vh-11rem)] min-h-[420px]">
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: `${100 / zoom}%`,
              }}
              className="origin-top-left inline-block"
            >
              <ResumePreviewCard
                data={displayData}
                isOptimized={version === "optimized"}
              />
            </div>
          </div>
        </section>

        <aside className="lg:col-span-3 order-3">
          <PreviewRightSidebar
            onDownloadPdf={handleDownloadPdf}
            onShareLink={handleShare}
            onPrint={handlePrint}
            pdfLoading={pdfLoading}
            pdfError={pdfError}
            jobContext={jobContext.company ?? "해당 채용"}
          />
        </aside>
        </main>
      </div>
    </div>
  );
}

export default function PreparePreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
        </div>
      }
    >
      <PreparePreviewContent />
    </Suspense>
  );
}
