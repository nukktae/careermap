"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import type { ResumeDisplayData } from "@/lib/data/resume-display";

const SECTION_HEADER_CLASS =
  "text-xs font-black text-[#2463E9] uppercase tracking-[0.2em] mb-4 border-b border-blue-100 pb-2";

interface ResumePreviewCardProps {
  data: ResumeDisplayData;
  /** When true, show "Optimized Version" watermark */
  isOptimized?: boolean;
}

export function ResumePreviewCard({
  data,
  isOptimized = false,
}: ResumePreviewCardProps) {
  const { profile, experience, projects, education, skills, certifications } = data;

  return (
    <div className="bg-white rounded-none shadow-2xl shadow-slate-300/50 border border-slate-100 w-full min-h-[297mm] p-8 sm:p-[60px] relative">
      {isOptimized && (
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
          <div className="w-2 h-2 bg-[#2463E9] rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-[#2463E9] uppercase tracking-widest">
            Optimized Version
          </span>
        </div>
      )}

      <div className="mb-8 sm:mb-12">
        <h4 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-2 sm:mb-3 tracking-tight">
          {profile.name}
        </h4>
        {profile.title && (
          <p className="text-base sm:text-lg text-[#2463E9] font-bold mb-4 sm:mb-6">
            {profile.title}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
          {profile.email && (
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {profile.email}
            </span>
          )}
          {profile.phone && (
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {profile.phone}
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {profile.location}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        <div className="lg:col-span-8 space-y-8 sm:space-y-10">
          {profile.summary && (
            <section>
              <h5 className={SECTION_HEADER_CLASS}>Professional Summary</h5>
              <p className="text-[13px] sm:text-[15px] text-slate-700 leading-relaxed font-medium">
                {profile.summary}
              </p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h5 className={SECTION_HEADER_CLASS}>Experience</h5>
              <div className="space-y-6 sm:space-y-8">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap justify-between items-end gap-2 mb-2">
                      <h6 className="text-base sm:text-lg font-bold text-slate-900">
                        {exp.company}
                      </h6>
                      {exp.period && (
                        <span className="text-xs sm:text-sm text-slate-400 font-medium">
                          {exp.period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#2463E9] font-bold mb-3 sm:mb-4">
                      {exp.role}
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      {exp.highlights.map((h, j) => (
                        <li
                          key={j}
                          className="text-xs sm:text-sm text-slate-600 leading-relaxed flex gap-2 sm:gap-3"
                        >
                          <span className="text-[#2463E9] font-bold shrink-0 mt-1">•</span>
                          <span>{h.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h5 className={SECTION_HEADER_CLASS}>Projects</h5>
              <div className="space-y-4">
                {projects.map((proj, i) => (
                  <div
                    key={i}
                    className="bg-slate-50/50 p-4 sm:p-5 rounded-xl border border-slate-100"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2 sm:mb-3">
                      <h6 className="text-sm sm:text-base font-bold text-slate-900">
                        {proj.project}
                      </h6>
                      {proj.period && (
                        <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                          {proj.period}
                        </span>
                      )}
                    </div>
                    {proj.role && (
                      <p className="text-xs text-slate-600 mb-2">
                        <span className="font-bold text-slate-800">역할:</span> {proj.role}
                      </p>
                    )}
                    {proj.details.length > 0 && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {proj.details.map((d, j) => (
                          <span key={j}>
                            {j > 0 && <br />}
                            {d}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8 sm:space-y-10">
          {education && (
            <section>
              <h5 className={SECTION_HEADER_CLASS}>Education</h5>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  {education.university}
                </p>
                {education.major && (
                  <p className="text-[10px] sm:text-xs text-slate-500 mb-1">
                    {education.major}
                  </p>
                )}
                {education.period && (
                  <p className="text-[10px] text-slate-400 font-medium">
                    {education.period}
                  </p>
                )}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h5 className={SECTION_HEADER_CLASS}>Core Skills</h5>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 24).map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h5 className={SECTION_HEADER_CLASS}>Certifications</h5>
              <div className="space-y-3">
                {certifications.map((c, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold text-slate-800">{c.name}</p>
                    {c.date && (
                      <p className="text-[10px] text-slate-400">{c.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
