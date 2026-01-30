"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Target, TrendingUp, CheckCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/20 dark:to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-success-500/10 rounded-full blur-3xl" />

      <div className="container-app relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>AI 기반 취업 준비 플랫폼</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6 animate-fade-in-up text-balance">
            취업 준비,{" "}
            <span className="text-gradient">이제 명확하게</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-foreground-secondary max-w-2xl mx-auto mb-8 animate-fade-in-up stagger-1 text-pretty leading-relaxed">
            AI가 분석하는 내 경쟁력과 맞춤 준비 전략.
            <br className="hidden sm:block" />
            취업 준비의 불확실성을 데이터로 해결하세요.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up stagger-2">
            <Button size="lg" asChild className="w-full sm:w-auto text-base px-8">
              <Link href="/signup">
                무료로 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto text-base px-8">
              <Link href="#how-it-works">
                <Play className="w-5 h-5 mr-2" />
                작동 방식 보기
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-foreground-secondary animate-fade-in-up stagger-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success-500" />
              <span>1,000+ 취업 성공</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success-500" />
              <span>서울대, 연세대, KAIST 학생 이용</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success-500" />
              <span>평균 매칭 정확도 92%</span>
            </div>
          </div>
        </div>

        {/* Hero Visual - Dashboard Preview */}
        <div className="mt-16 lg:mt-20 max-w-5xl mx-auto animate-fade-in-up stagger-4">
          <div className="relative">
            {/* Browser frame */}
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-background-secondary border-b border-border">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error-500" />
                  <div className="w-3 h-3 rounded-full bg-warning-500" />
                  <div className="w-3 h-3 rounded-full bg-success-500" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background rounded-md px-4 py-1.5 text-sm text-foreground-muted text-center">
                    careermap.kr/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="p-6 lg:p-8 bg-background-secondary">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Match Summary Card */}
                  <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">내 매칭 현황</h3>
                      <Target className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground-secondary">지원 가능</span>
                        <span className="text-sm font-semibold text-success-600">3개</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground-secondary">준비 필요</span>
                        <span className="text-sm font-semibold text-warning-600">8개</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground-secondary">도전 목표</span>
                        <span className="text-sm font-semibold text-error-600">5개</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="text-2xl font-bold text-foreground">16개</div>
                      <div className="text-sm text-foreground-secondary">총 매칭 채용</div>
                    </div>
                  </div>

                  {/* Progress Card */}
                  <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">학습 진행률</h3>
                      <TrendingUp className="w-5 h-5 text-success-500" />
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground-secondary">Docker 기초</span>
                        <span className="text-sm font-medium text-foreground">75%</span>
                      </div>
                      <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-primary-500 rounded-full" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground-secondary">AWS EC2</span>
                        <span className="text-sm font-medium text-foreground">40%</span>
                      </div>
                      <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                        <div className="h-full w-2/5 bg-primary-500 rounded-full" />
                      </div>
                    </div>
                    <div className="text-sm text-foreground-secondary">
                      2주차 진행 중
                    </div>
                  </div>

                  {/* Match Score Card */}
                  <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">네이버 FE 개발자</h3>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold match-medium">
                        준비 필요
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-background-secondary"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeDasharray={`${68 * 2.26} ${100 * 2.26}`}
                            strokeLinecap="round"
                            className="text-warning-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-foreground">68%</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-foreground-secondary mb-2">부족한 스킬</div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 text-xs font-medium bg-error-100 text-error-700 rounded-full dark:bg-error-900/30 dark:text-error-400">
                            Docker
                          </span>
                          <span className="px-2 py-0.5 text-xs font-medium bg-error-100 text-error-700 rounded-full dark:bg-error-900/30 dark:text-error-400">
                            AWS
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      준비 시작하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-lg border border-border animate-float hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">면접 성공!</div>
                  <div className="text-xs text-foreground-secondary">카카오 합격</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
