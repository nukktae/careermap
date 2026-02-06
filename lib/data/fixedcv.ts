/**
 * Optimized CV from fixedcv.json – same section shape as mycv for comparison/highlight.
 */

import fixedcvData from "../../fixedcv.json";

interface FixedCvProfile {
  name_kr?: string;
  name_en?: string;
  title?: string;
  summary?: string;
  contact?: Record<string, string>;
}

interface FixedCvExperience {
  role: string;
  company: string;
  location?: string;
  period?: { start: string; end: string };
  highlights?: string[];
}

interface FixedCvProject {
  role: string;
  project: string;
  location?: string;
  period?: { start: string; end: string };
  details?: string[];
}

interface FixedCvEducation {
  university?: string;
  major?: string;
  double_major?: string;
  period?: { start: string; end: string };
}

interface FixedCvSkills {
  ai_content?: string[];
  design?: string[];
  frontend?: string[];
  tools?: string[];
  interest?: string[];
  [key: string]: string[] | undefined;
}

function formatPeriod(p?: { start: string; end: string }): string {
  if (!p) return "";
  return `${p.start} – ${p.end}`;
}

/** Map fixedcv.json to flat sections (same keys as mycv: summary, education, experience, projects, skills). */
export function getFixedCvSections(): Record<string, string> {
  const p = (fixedcvData as { profile?: FixedCvProfile }).profile;
  const summary = [p?.title, p?.summary].filter(Boolean).join("\n\n") || "";

  const edu = (fixedcvData as { education?: FixedCvEducation }).education;
  const education = edu
    ? [
        `${edu.university ?? ""} · ${edu.major ?? ""}${edu.double_major ? ` / ${edu.double_major}` : ""}`.trim(),
        formatPeriod(edu.period),
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const expList = (fixedcvData as { experience?: FixedCvExperience[] }).experience ?? [];
  const experience = expList
    .map((e) => {
      const period = formatPeriod(e.period);
      const loc = e.location ? ` (${e.location})` : "";
      const head = `${e.role} | ${e.company}${loc}${period ? ` · ${period}` : ""}`;
      const bullets = (e.highlights ?? []).map((h) => `• ${h}`).join("\n");
      return bullets ? `${head}\n${bullets}` : head;
    })
    .join("\n\n");

  const projList = (fixedcvData as { projects_and_activities?: FixedCvProject[] }).projects_and_activities ?? [];
  const projects = projList
    .map((pr) => {
      const period = formatPeriod(pr.period);
      const loc = pr.location ? ` (${pr.location})` : "";
      const head = `${pr.role} · ${pr.project}${loc}${period ? ` · ${period}` : ""}`;
      const bullets = (pr.details ?? []).map((d) => `• ${d}`).join("\n");
      return bullets ? `${head}\n${bullets}` : head;
    })
    .join("\n\n");

  const skillObj = (fixedcvData as { skills?: FixedCvSkills }).skills ?? {};
  const skillLists = [
    skillObj.ai_content,
    skillObj.design,
    skillObj.frontend,
    skillObj.tools,
    skillObj.interest,
  ].filter(Boolean) as string[][];
  const skills = skillLists.flat().join(", ");

  return {
    summary,
    education,
    experience,
    projects,
    skills,
  };
}

const FIXEDCV_SECTION_ORDER = ["summary", "education", "experience", "projects", "skills"] as const;
const FIXEDCV_SECTION_LABELS: Record<(typeof FIXEDCV_SECTION_ORDER)[number], string> = {
  summary: "자기소개",
  education: "학력",
  experience: "경력",
  projects: "프로젝트",
  skills: "스킬",
};

/** Full optimized CV text (all sections with labels) for copy/export. */
export function getFixedCvFullText(): string {
  const sections = getFixedCvSections();
  return FIXEDCV_SECTION_ORDER.map((key) => {
    const label = FIXEDCV_SECTION_LABELS[key];
    const content = (sections[key] ?? "").trim();
    return content ? `${label}\n${content}` : "";
  })
    .filter(Boolean)
    .join("\n\n");
}

/** Raw CV data for PDF/export (fixedcv.json). */
export interface FixedCvRaw {
  profile?: {
    name_kr?: string;
    name_en?: string;
    title?: string;
    summary?: string;
    contact?: Record<string, string>;
  };
  experience?: Array<{
    role: string;
    company: string;
    location?: string;
    period?: { start: string; end: string };
    highlights?: string[];
  }>;
  projects_and_activities?: Array<{
    role: string;
    project: string;
    location?: string;
    period?: { start: string; end: string };
    details?: string[];
  }>;
  education?: {
    university?: string;
    major?: string;
    double_major?: string;
    period?: { start: string; end: string };
  };
  languages?: Array<{ language: string; level: string }>;
  skills?: Record<string, string[]>;
}

export const fixedcvRaw: FixedCvRaw = fixedcvData as FixedCvRaw;
