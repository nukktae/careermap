"use client";

import { FileDown, Link2, Printer } from "lucide-react";

interface PreviewRightSidebarProps {
  onDownloadPdf: () => void;
  onShareLink: () => void;
  onPrint: () => void;
  pdfLoading?: boolean;
  pdfError?: string | null;
  /** Company or job title for tip message */
  jobContext?: string;
}

export function PreviewRightSidebar({
  onDownloadPdf,
  onShareLink,
  onPrint,
  pdfLoading = false,
  pdfError = null,
  jobContext = "해당 채용",
}: PreviewRightSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24 z-10">
        <h3 className="text-lg font-bold text-slate-900 mb-6">파일 내보내기</h3>
        <div className="space-y-3">
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={pdfLoading}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-[#2463E9] hover:text-[#2463E9] transition-all disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <FileDown className="w-5 h-5 text-red-500 shrink-0" />
              <span>{pdfLoading ? "생성 중…" : "PDF 다운로드"}</span>
            </div>
          </button>
          <button
            type="button"
            onClick={onShareLink}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-[#2463E9] hover:text-[#2463E9] transition-all"
          >
            <div className="flex items-center gap-3">
              <Link2 className="w-5 h-5 text-blue-400 shrink-0" />
              <span>공유 링크 복사</span>
            </div>
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-[#2463E9] hover:text-[#2463E9] transition-all"
          >
            <div className="flex items-center gap-3">
              <Printer className="w-5 h-5 text-slate-400 shrink-0" />
              <span>인쇄하기</span>
            </div>
          </button>
        </div>

        {pdfError && (
          <p className="text-sm text-red-500 mt-3" role="alert">
            {pdfError}
          </p>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <p className="text-xs text-[#2463E9] font-bold mb-1">Expert Advice</p>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              현재 버전은 {jobContext} 직무 키워드와 잘 매칭됩니다. 이대로 지원하시는 것을
              권장합니다!
            </p>
          </div>
          <a
            href="/jobs"
            className="block w-full py-4 bg-[#2463E9] text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-center text-sm"
          >
            이 버전으로 최종 지원
          </a>
          <p className="text-center text-[10px] text-slate-400 mt-4">
            지원 완료 후에는 수정이 불가능합니다.
          </p>
        </div>
      </div>
    </aside>
  );
}
