"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Target,
  TrendingUp,
  FileText,
  Search,
  ClipboardList,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";

// Mock data
const userData = {
  name: "철수",
  matchSummary: {
    total: 16,
    applyNow: 3,
    prepNeeded: 8,
    stretchGoal: 5,
  },
  learningPlan: {
    title: "Docker 기초",
    week: 2,
    totalWeeks: 4,
    progress: 75,
    nextTask: "Docker Compose로 멀티 컨테이너 앱 실행",
  },
  applications: {
    applied: 5,
    interview: 2,
    offer: 0,
  },
  recentJobs: [
    {
      id: 1,
      company: "네이버",
      title: "프론트엔드 개발자",
      match: 72,
      logo: "N",
      badge: "prep",
    },
    {
      id: 2,
      company: "카카오",
      title: "웹 개발자",
      match: 68,
      logo: "K",
      badge: "prep",
    },
    {
      id: 3,
      company: "토스",
      title: "React 개발자",
      match: 89,
      logo: "T",
      badge: "apply",
    },
  ],
};

const quickActions = [
  {
    icon: FileText,
    label: "이력서 최적화",
    href: "/prepare/resume",
    color: "primary",
  },
  {
    icon: Search,
    label: "채용 찾기",
    href: "/jobs",
    color: "success",
  },
  {
    icon: ClipboardList,
    label: "지원 추가",
    href: "/track",
    color: "warning",
  },
  {
    icon: Lightbulb,
    label: "인사이트 보기",
    href: "/track/insights",
    color: "primary",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              안녕하세요, {userData.name}님!
            </h1>
            <p className="text-white/80">
              오늘 <span className="font-semibold text-white">3개</span>의 새로운
              매칭이 있어요
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border hover:border-primary-200 hover:bg-primary-50/50 dark:hover:border-primary-800 dark:hover:bg-primary-950/20 transition-all"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                action.color === "primary"
                  ? "bg-primary-100 dark:bg-primary-900/30"
                  : action.color === "success"
                  ? "bg-success-100 dark:bg-success-900/30"
                  : "bg-warning-100 dark:bg-warning-900/30"
              }`}
            >
              <action.icon
                className={`w-6 h-6 ${
                  action.color === "primary"
                    ? "text-primary-600 dark:text-primary-400"
                    : action.color === "success"
                    ? "text-success-600 dark:text-success-400"
                    : "text-warning-600 dark:text-warning-400"
                }`}
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Summary */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">내 매칭 현황</h2>
            <Target className="w-5 h-5 text-primary-500" />
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-500" />
                <span className="text-sm text-foreground-secondary">지원 가능</span>
              </div>
              <span className="text-sm font-semibold text-success-600 dark:text-success-400">
                {userData.matchSummary.applyNow}개
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning-500" />
                <span className="text-sm text-foreground-secondary">준비 필요</span>
              </div>
              <span className="text-sm font-semibold text-warning-600 dark:text-warning-400">
                {userData.matchSummary.prepNeeded}개
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-error-500" />
                <span className="text-sm text-foreground-secondary">도전 목표</span>
              </div>
              <span className="text-sm font-semibold text-error-600 dark:text-error-400">
                {userData.matchSummary.stretchGoal}개
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-3xl font-bold text-foreground mb-1">
              {userData.matchSummary.total}개
            </div>
            <p className="text-sm text-foreground-secondary">총 매칭 채용</p>
          </div>

          <Button asChild className="w-full mt-4">
            <Link href="/jobs">
              모든 채용 보기
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Learning Progress */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">학습 진행률</h2>
            <TrendingUp className="w-5 h-5 text-success-500" />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">
                {userData.learningPlan.title}
              </span>
              <span className="text-sm text-primary-500 font-semibold">
                {userData.learningPlan.progress}%
              </span>
            </div>
            <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all"
                style={{ width: `${userData.learningPlan.progress}%` }}
              />
            </div>
            <p className="text-sm text-foreground-secondary mt-2">
              {userData.learningPlan.week}주차 / {userData.learningPlan.totalWeeks}주
            </p>
          </div>

          <div className="p-3 rounded-lg bg-background-secondary mb-4">
            <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-1">
              <Clock className="w-4 h-4" />
              <span>다음 할 일</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {userData.learningPlan.nextTask}
            </p>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/prepare">
              계속하기
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Application Status */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">지원 현황</h2>
            <ClipboardList className="w-5 h-5 text-warning-500" />
          </div>

          <div className="flex items-center justify-around mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {userData.applications.applied}
              </div>
              <div className="text-sm text-foreground-secondary">지원함</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">
                {userData.applications.interview}
              </div>
              <div className="text-sm text-foreground-secondary">면접</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-success-500">
                {userData.applications.offer}
              </div>
              <div className="text-sm text-foreground-secondary">합격</div>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/track">
              지원 현황 보기
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Job Matches */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">최근 매칭된 채용</h2>
          <Link
            href="/jobs"
            className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
          >
            전체 보기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {userData.recentJobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center gap-4 p-4 hover:bg-background-secondary transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-background-secondary flex items-center justify-center text-foreground font-bold text-lg">
                {job.logo}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {job.title}
                </h3>
                <p className="text-sm text-foreground-secondary">{job.company}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    job.badge === "apply"
                      ? "match-high"
                      : job.badge === "prep"
                      ? "match-medium"
                      : "match-low"
                  }`}
                >
                  {job.match}%
                </span>
                <ChevronRight className="w-5 h-5 text-foreground-muted" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Insight Teaser */}
      <div className="bg-gradient-to-r from-primary-50 to-success-50 dark:from-primary-950/30 dark:to-success-950/30 rounded-xl p-6 border border-primary-100 dark:border-primary-900">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              새로운 인사이트가 준비되었어요!
            </h3>
            <p className="text-sm text-foreground-secondary mb-3">
              매칭 점수 65% 이상일 때 면접률이 70% 더 높아요. 더 자세한 분석을
              확인해보세요.
            </p>
            <Button asChild size="sm">
              <Link href="/track/insights">
                인사이트 보기
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
