"use client";

import { Check, Wand2, FileUp } from "lucide-react";

interface PreviewLeftSidebarProps {
  version: "original" | "optimized";
  onVersionChange: (v: "original" | "optimized") => void;
  /** JD fit score 0–100 (e.g. 92). Shown only when version is optimized. */
  jdFitScore?: number;
}

const RECENT_EDITS = [
  { icon: Wand2, label: "AI 문장 다듬기 적용", time: "2025.05.20 14:30", color: "bg-blue-50 text-[#2463E9]" },
  { icon: FileUp, label: "원본 이력서 업로드", time: "2025.05.18 09:12", color: "bg-slate-50 text-slate-400" },
];

export function PreviewLeftSidebar({
  version,
  onVersionChange,
  jdFitScore = 92,
}: PreviewLeftSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">보기 설정</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              이력서 버전
            </p>
            <div className="bg-slate-100 p-1 rounded-xl flex">
              <button
                type="button"
                onClick={() => onVersionChange("original")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  version === "original"
                    ? "bg-white text-[#2463E9] font-bold shadow-sm"
                    : "text-slate-500 hover:bg-white/50"
                }`}
              >
                원본
              </button>
              <button
                type="button"
                onClick={() => onVersionChange("optimized")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  version === "optimized"
                    ? "bg-white text-[#2463E9] font-bold shadow-sm"
                    : "text-slate-500 hover:bg-white/50"
                }`}
              >
                AI 최적화
              </button>
            </div>
          </div>
          {version === "optimized" && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                최적화 리포트
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">JD 적합도</span>
                  <span className="text-sm font-bold text-green-500">{jdFitScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${jdFitScore}%` }}
                  />
                </div>
                <ul className="text-xs text-slate-500 space-y-2 pt-2">
                  <li className="flex gap-2">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    핵심 키워드 반영됨
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    수치 중심 성과 강조됨
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">최근 수정 내역</h3>
        <div className="space-y-4">
          {RECENT_EDITS.map((item) => (
            <div key={item.label} className="flex gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.color}`}
              >
                <item.icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800">{item.label}</p>
                <p className="text-[10px] text-slate-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
