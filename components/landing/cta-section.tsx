"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function CTASection() {
  return (
    <section id="cta" className="py-24 bg-background">
      <div className="container-app">
        <div className="bg-primary-500 rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden">
          {/* Decorative background icon */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
            aria-hidden
          >
            <Zap
              className="absolute -top-20 -left-20 w-[400px] h-[400px] rotate-12"
              strokeWidth={1}
            />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 relative z-10">
            취업 준비, 더 이상 혼자 고민하지 마세요.
          </h2>
          <p className="text-xl text-primary-100 mb-12 relative z-10 max-w-2xl mx-auto leading-relaxed">
            AI가 분석하고, 전략을 세우고, 당신의 준비를 돕습니다.
            <br className="hidden sm:block" />
            지금 바로 첫 번째 이력서를 분석해 보세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link
              href="/signup"
              className="px-10 py-5 bg-white text-primary-600 text-lg font-bold rounded-2xl hover:bg-primary-50 transition-all shadow-xl"
            >
              무료로 시작하기
            </Link>
            <Link
              href="#features"
              className="px-10 py-5 bg-primary-700/50 text-white text-lg font-bold rounded-2xl border border-primary-400/30 hover:bg-primary-700 transition-all"
            >
              서비스 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
