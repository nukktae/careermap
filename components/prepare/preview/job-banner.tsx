"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";

interface JobBannerProps {
  jobId: number;
  company: string;
  title: string;
  logoUrl?: string | null;
}

export function JobBanner({ jobId, company, title, logoUrl }: JobBannerProps) {
  return (
    <section className="bg-white border-b border-slate-200 rounded-t-2xl overflow-hidden">
      <div className="px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden bg-white shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#2463E9]" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-bold text-slate-400">{company}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-[#2463E9] text-[10px] font-bold rounded uppercase">
                  In Preparation
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/jobs/${jobId}`}
              className="px-4 py-2.5 sm:px-5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors"
            >
              채용 공고 보기
            </Link>
            <Link
              href={`/jobs/${jobId}`}
              className="px-4 py-2.5 sm:px-5 bg-[#2463E9] text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
            >
              지원하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
