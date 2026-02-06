/**
 * CV data from mycv.json – mapped to resume sections for Prepare 이력서 최적화.
 * Show in sections (summary, education, experience, projects, skills), not all at once.
 */

import mycvData from "./mycv.json";

interface MyCvExperience {
  role: string;
  company: string;
  location?: string;
  period?: { start: string; end: string };
  highlights?: string[];
}

interface MyCvProject {
  role: string;
  project: string;
  location?: string;
  period?: { start: string; end: string };
  details?: string[];
}

interface MyCvEducation {
  university: string;
  major: string;
  double_major?: string;
  period?: { start: string; end: string };
}

interface MyCvSkills {
  design?: string[];
  frontend?: string[];
  backend?: string[];
  database?: string[];
  infra_ai?: string[];
  tools?: string[];
  data?: string[];
}

function formatPeriod(p?: { start: string; end: string }): string {
  if (!p) return "";
  return `${p.start} – ${p.end}`;
}

/** Map mycv.json to flat sections: summary, education, experience, projects, skills */
export function getMyCvSections(): Record<string, string> {
  const p = (mycvData as { profile?: { summary?: string; title?: string } }).profile;
  const summary = [p?.title, p?.summary].filter(Boolean).join("\n\n") || "";

  const edu = (mycvData as { education?: MyCvEducation }).education;
  const education = edu
    ? [
        `${edu.university} · ${edu.major}${edu.double_major ? ` / ${edu.double_major}` : ""}`,
        formatPeriod(edu.period),
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const expList = (mycvData as { experience?: MyCvExperience[] }).experience ?? [];
  const experience = expList
    .map((e) => {
      const period = formatPeriod(e.period);
      const loc = e.location ? ` (${e.location})` : "";
      const head = `${e.role} | ${e.company}${loc}${period ? ` · ${period}` : ""}`;
      const bullets = (e.highlights ?? []).map((h) => `• ${h}`).join("\n");
      return bullets ? `${head}\n${bullets}` : head;
    })
    .join("\n\n");

  const projList = (mycvData as { projects_and_activities?: MyCvProject[] }).projects_and_activities ?? [];
  const projects = projList
    .map((pr) => {
      const period = formatPeriod(pr.period);
      const loc = pr.location ? ` (${pr.location})` : "";
      const head = `${pr.role} · ${pr.project}${loc}${period ? ` · ${period}` : ""}`;
      const bullets = (pr.details ?? []).map((d) => `• ${d}`).join("\n");
      return bullets ? `${head}\n${bullets}` : head;
    })
    .join("\n\n");

  const skillObj = (mycvData as { skills?: MyCvSkills }).skills ?? {};
  const skillLists = [
    skillObj.design,
    skillObj.frontend,
    skillObj.backend,
    skillObj.database,
    skillObj.infra_ai,
    skillObj.tools,
    skillObj.data,
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

export const MYCV_SECTION_ORDER = ["summary", "education", "experience", "projects", "skills"] as const;
export const MYCV_SECTION_LABELS: Record<(typeof MYCV_SECTION_ORDER)[number], string> = {
  summary: "자기소개",
  education: "학력",
  experience: "경력",
  projects: "프로젝트",
  skills: "스킬",
};

/** Single full CV text (all sections with labels) for preview / export. */
export function getMyCvFullText(): string {
  const sections = getMyCvSections();
  return MYCV_SECTION_ORDER.map((key) => {
    const label = MYCV_SECTION_LABELS[key];
    const content = (sections[key] ?? "").trim();
    return content ? `${label}\n${content}` : "";
  })
    .filter(Boolean)
    .join("\n\n");
}
