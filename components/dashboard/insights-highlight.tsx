"use client";

import Link from "next/link";
import { AppIcon } from "@/components/ui/app-icon";

export function InsightsHighlight() {
  return (
    <section
      id="insights-highlight"
      className="relative overflow-hidden bg-primary-500 p-8 sm:p-10 rounded-3xl text-primary-foreground flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-lg"
      aria-labelledby="insights-highlight-heading"
    >
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium text-white">
          <AppIcon name="lamp" className="w-4 h-4 text-white" />
          <span>인사이트 팁</span>
        </div>
        <h2
          id="insights-highlight-heading"
          className="text-xl sm:text-2xl font-bold leading-tight"
        >
          매칭 점수 65% 이상일 때
          <br />
          면접률이 70% 더 높아요.
        </h2>
        <Link
          href="/track/insights"
          className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors"
        >
          인사이트 상세 보기
          <AppIcon name="arrow-right" className="w-4 h-4" />
        </Link>
      </div>
      <div className="relative z-10 w-full max-w-[240px] h-[160px] bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shrink-0">
        <div className="flex items-end gap-2 mb-4 h-[72px]">
          <div className="flex-1 h-8 bg-white/30 rounded-md" />
          <div className="flex-1 h-14 bg-white/30 rounded-md" />
          <div className="flex-1 h-[72px] bg-white/60 rounded-md" />
          <div className="flex-1 h-11 bg-white/30 rounded-md" />
        </div>
        <p className="text-xs text-center text-white/80 font-medium">
          점수 대비 면접 성공률 분석
        </p>
      </div>
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl pointer-events-none" aria-hidden />
    </section>
  );
}
