"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getResumePreview } from "@/lib/data/prepare";

export default function PreparePreviewPage() {
  const { original, optimized } = getResumePreview();
  const [activeTab, setActiveTab] = useState("original");

  const handleDownloadPdf = () => {
    if (typeof window !== "undefined") {
      window.alert("PDF 다운로드는 준비 중입니다. 곧 이용하실 수 있어요.");
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
        <Button size="sm" onClick={handleDownloadPdf}>
          PDF 다운로드
        </Button>
        <Button size="sm" variant="outline" onClick={handleShare}>
          링크 공유
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => typeof window !== "undefined" && window.print()}
        >
          인쇄
        </Button>
      </div>

      {/* Desktop: split */}
      <div className="hidden lg:grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 min-h-[320px]">
          <h3 className="font-semibold text-foreground mb-3">원본</h3>
          <pre className="text-sm text-foreground-secondary whitespace-pre-wrap font-sans">
            {original}
          </pre>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 min-h-[320px]">
          <h3 className="font-semibold text-foreground mb-3">최적화</h3>
          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
            {optimized}
          </pre>
        </div>
      </div>

      {/* Mobile: tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="lg:hidden w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="original">원본</TabsTrigger>
          <TabsTrigger value="optimized">최적화</TabsTrigger>
        </TabsList>
        <TabsContent value="original" className="mt-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <pre className="text-sm text-foreground-secondary whitespace-pre-wrap font-sans">
              {original}
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="optimized" className="mt-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
              {optimized}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
