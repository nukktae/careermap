"use client";


const SECTION_HEADER_CLASS =
  "text-xs font-black text-[#2463E9] uppercase tracking-[0.2em] mb-4 border-b border-blue-100 pb-2";

interface CoverLetterPreviewCardProps {
  entries: [string, string][];
}

export function CoverLetterPreviewCard({ entries }: CoverLetterPreviewCardProps) {
  return (
    <div className="bg-white rounded-none shadow-2xl shadow-slate-300/50 border border-slate-100 w-full min-h-[297mm] p-8 sm:p-[60px] relative">
      <div className="space-y-8 sm:space-y-10">
        {entries.map(([title, content]) => (
          <section key={title}>
            <h5 className={SECTION_HEADER_CLASS}>{title}</h5>
            <p className="text-[13px] sm:text-[15px] text-slate-700 leading-relaxed font-medium whitespace-pre-line">
              {content}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
