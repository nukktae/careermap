"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getMyCvFullText } from "@/lib/data/mycv";
import { getFixedCvSections, fixedcvRaw } from "@/lib/data/fixedcv";
import { MYCV_SECTION_ORDER, MYCV_SECTION_LABELS } from "@/lib/data/mycv";

function OptimizedCvCard({ className }: { className?: string }) {
  const sections = useMemo(() => getFixedCvSections(), []);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden min-h-[320px] shadow-sm",
        className
      )}
    >
      <div className="p-5 sm:p-6 space-y-6">
        {MYCV_SECTION_ORDER.map((key) => {
          const content = (sections[key] ?? "").trim();
          if (!content) return null;
          const label = MYCV_SECTION_LABELS[key];
          const lines = content.split(/\n/);
          return (
            <section key={key} className="space-y-2">
              <h4 className="text-[11px] font-semibold text-foreground-muted uppercase tracking-widest border-b border-border/80 pb-2">
                {label}
              </h4>
              <div className="text-[15px] text-foreground leading-relaxed font-sans space-y-1.5">
                {lines.map((line, i) => (
                  <p key={i} className="whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function PreparePreviewPage() {
  const fullText = useMemo(() => getMyCvFullText(), []);
  const original = fullText;
  const [activeTab, setActiveTab] = useState("original");

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    if (typeof window === "undefined") return;
    setPdfError(null);
    setPdfLoading(true);
    try {
      const renderer = await import("@react-pdf/renderer");
      const { CvPdfDocument } = await import("@/components/prepare/CvPdfDocument");
      const blob = await renderer.pdf(<CvPdfDocument data={fixedcvRaw} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CV.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      const message = e instanceof Error ? e.message : "PDF 생성에 실패했어요.";
      setPdfError(message);
      console.error("PDF download error:", e);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      window.alert("링크가 복사되었습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          이력서 미리보기
        </h1>
        <p className="text-foreground-secondary">
          원본과 최적화 버전을 비교하고 PDF로 내려받으세요.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={handleDownloadPdf} disabled={pdfLoading}>
          {pdfLoading ? "생성 중…" : "PDF 다운로드"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={handleShare}>
          링크 공유
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            if (typeof window !== "undefined") window.print();
          }}
        >
          인쇄
        </Button>
      </div>
      {pdfError && (
        <p className="text-sm text-destructive" role="alert">
          {pdfError}
        </p>
      )}

      {/* Desktop: split */}
      <div className="hidden lg:grid grid-cols-2 gap-5">
        <div className="rounded-xl border border-border bg-card overflow-hidden min-h-[320px] shadow-sm">
          <div className="p-5 sm:p-6">
            <h3 className="text-[11px] font-semibold text-foreground-muted uppercase tracking-widest border-b border-border/80 pb-2 mb-4">
              원본
            </h3>
            <pre className="text-sm text-foreground-secondary whitespace-pre-wrap font-sans leading-relaxed">
              {original}
            </pre>
          </div>
        </div>
        <OptimizedCvCard />
      </div>

      {/* Mobile: tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="lg:hidden w-full">
        <TabsList className="w-full grid grid-cols-2 h-11 bg-muted/50">
          <TabsTrigger value="original" className="text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
            원본
          </TabsTrigger>
          <TabsTrigger value="optimized" className="text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm">
            최적화
          </TabsTrigger>
        </TabsList>
        <TabsContent value="original" className="mt-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm min-h-[200px]">
            <div className="p-5">
              <pre className="text-sm text-foreground-secondary whitespace-pre-wrap font-sans leading-relaxed">
                {original}
              </pre>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="optimized" className="mt-4">
          <OptimizedCvCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
