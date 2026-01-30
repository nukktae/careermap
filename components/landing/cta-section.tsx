"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container-app relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>지금 시작하면 7일 무료</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            취업 준비, 더 이상 혼자 고민하지 마세요
          </h2>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/80 mb-10 text-pretty">
            AI가 분석하고, 전략을 제시하고, 준비를 도와드립니다.
            <br className="hidden sm:block" />
            지금 바로 시작해서 목표 회사에 한 발짝 더 다가가세요.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto text-base px-8 bg-white text-primary-700 hover:bg-white/90"
            >
              <Link href="/signup">
                무료로 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto text-base px-8 border-white/30 text-white hover:bg-white/10"
            >
              <Link href="#features">기능 더 알아보기</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/20">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                1,000+
              </div>
              <div className="text-sm text-white/70">취업 성공</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                92%
              </div>
              <div className="text-sm text-white/70">매칭 정확도</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                4.9/5
              </div>
              <div className="text-sm text-white/70">사용자 평점</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
