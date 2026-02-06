"use client";

import Link from "next/link";
import { TrendingUp, AlertCircle, Zap, BookOpen, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/lib/hooks/use-applications";
import { getInsightsData } from "@/lib/data/track";

export default function TrackInsightsPage() {
  const { applications, isLoading } = useApplications();
  const applicationCount = applications.length;
  const insights = getInsightsData(applicationCount);
  const showGate = applicationCount < 10;

  if (isLoading) {
    return (
      <div className="container-app py-12 text-center text-foreground-secondary">
        로딩 중…
      </div>
    );
  }

  if (showGate) {
    return (
      <div className="container-app py-12">
        <div className="rounded-xl border border-border bg-background-secondary p-12 text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            10건 이상 지원하면 인사이트를 볼 수 있어요
          </h2>
          <p className="text-foreground-secondary mb-6">
            현재 <strong className="text-foreground">{applicationCount}건</strong>의
            지원이에요. 조금만 더 지원해 보세요!
          </p>
          <Button asChild className="rounded-xl">
            <Link href="/track">지원 현황 보기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground">인사이트</h1>
        <p className="text-foreground-secondary mt-1">
          지원 패턴을 바탕으로 한 맞춤 인사이트예요.
        </p>
      </div>

      {/* A. Match Score vs. Success */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          매칭 점수 vs. 성과
        </h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <p className="text-2xl font-bold text-foreground">
              매칭 {insights!.matchVsSuccess.threshold}% 이상일 때 면접률{" "}
              {insights!.matchVsSuccess.interviewRate}%
            </p>
            <p className="text-sm text-foreground-secondary mt-2">
              {insights!.matchVsSuccess.threshold}% 이상 매칭되는 채용에 집중해
              보세요.
            </p>
          </div>
          <div className="w-32 h-12 rounded-lg bg-background-secondary overflow-hidden flex">
            <div
              className="bg-primary-500 h-full rounded-l-lg"
              style={{
                width: `${insights!.matchVsSuccess.interviewRate}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* B. Common Rejection Reasons */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-warning-500" />
          자주 나온 탈락 사유
        </h2>
        <ul className="space-y-2">
          {insights!.rejectionReasons.map((reason, i) => (
            <li
              key={i}
              className="text-sm text-foreground-secondary flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-warning-500 shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </section>

      {/* C. Application Speed */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-success-500" />
          지원 속도
        </h2>
        <p className="text-foreground mb-1">
          평균 지원 시기: 공고 <strong>{insights!.avgDaysToApply}일</strong> 후
        </p>
        <p className="text-sm text-foreground-secondary mb-2">
          {insights!.applyWithinDaysRecommendation}일 이내 지원 시 응답률이{" "}
          {insights!.responseRateWhenFast}% 높아요.
        </p>
        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
          더 빠르게 지원해 보세요.
        </p>
      </section>

      {/* D. Skill Progress */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary-500" />
          스킬 성장
        </h2>
        <p className="text-foreground mb-1">
          최근 {insights!.skillProgress.periodWeeks}주 매칭 점수{" "}
          <strong className="text-success-600 dark:text-success-400">
            +{insights!.skillProgress.improvementPercent}%
          </strong>{" "}
          상승
        </p>
        <p className="text-sm text-foreground-secondary mb-2">
          {insights!.skillProgress.skillsAdded.join(", ")}를 이력서에 반영했어요.
        </p>
        <div className="w-full h-2 rounded-full bg-background-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-success-500 transition-all"
            style={{
              width: `${Math.min(100, 50 + insights!.skillProgress.improvementPercent * 0.5)}%`,
            }}
          />
        </div>
      </section>

      {/* E. Industry Insights */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-foreground-muted" />
          산업·규모 인사이트
        </h2>
        <p className="text-foreground mb-1">
          지원의 <strong>{insights!.industryBreakdown.startupsPercent}%</strong>가
          스타트업이에요.
        </p>
        <p className="text-sm text-foreground-secondary mb-2">
          중소·중견 면접률 {insights!.industryBreakdown.midSizeInterviewRate}% —
          중소·중견도 검토해 보세요.
        </p>
      </section>
    </div>
  );
}
