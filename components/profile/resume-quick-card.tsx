"use client";

import Link from "next/link";
import { Download, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProfileResumeQuickCardProps {
  onDownload?: () => void;
}

export function ProfileResumeQuickCard({ onDownload }: ProfileResumeQuickCardProps) {
  return (
    <div className="bg-foreground text-background rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-2">이력서</h3>
      <p className="text-background/80 text-sm mb-6 leading-relaxed">
        이력서 편집 및 PDF 저장은 이력서 탭에서 할 수 있어요.
      </p>
      <div className="flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full h-11 bg-background text-foreground rounded-xl font-bold text-sm hover:bg-background/90"
          onClick={onDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          이력서 다운로드
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full h-11 bg-foreground/10 text-background border-border/30 rounded-xl font-bold text-sm hover:bg-foreground/20"
        >
          <Link href="/profile/resume">
            <FileEdit className="w-4 h-4 mr-2" />
            이력서 편집
          </Link>
        </Button>
      </div>
    </div>
  );
}
