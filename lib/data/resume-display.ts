/**
 * Unified resume display data for the Prepare 이력서 미리보기 screen.
 * Maps mycv (original) and fixedcv (AI optimized) into a single shape for rendering.
 */

import mycvData from "./mycv.json";
import { fixedcvRaw } from "./fixedcv";

export interface ResumeDisplayProfile {
  name: string;
  title: string;
  summary: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface ResumeDisplayExperience {
  company: string;
  role: string;
  period: string;
  highlights: Array<{ lead?: string; text: string }>;
}

export interface ResumeDisplayProject {
  project: string;
  role: string;
  period: string;
  details: string[];
}

export interface ResumeDisplayEducation {
  university: string;
  major: string;
  period: string;
}

export interface ResumeDisplayData {
  profile: ResumeDisplayProfile;
  experience: ResumeDisplayExperience[];
  projects: ResumeDisplayProject[];
  education: ResumeDisplayEducation | null;
  skills: string[];
  certifications: Array<{ name: string; date?: string }>;
}

function formatPeriod(p?: { start: string; end: string }): string {
  if (!p) return "";
  const end = (p.end || "").toLowerCase() === "present" ? "현재" : p.end;
  return `${p.start} — ${end}`;
}

function getLocation(contact?: Record<string, string>): string | undefined {
  return contact?.location ?? contact?.address;
}

/** Original resume from mycv.json */
export function getResumeDisplayOriginal(): ResumeDisplayData {
  const p = (mycvData as { profile?: { name_kr?: string; name_en?: string; title?: string; summary?: string; contact?: Record<string, string> } }).profile;
  const contact = p?.contact ?? {};
  const edu = (mycvData as { education?: { university?: string; major?: string; double_major?: string; period?: { start: string; end: string } } }).education;
  const expList = (mycvData as { experience?: Array<{ company: string; role: string; location?: string; period?: { start: string; end: string }; highlights?: string[] }> }).experience ?? [];
  const projList = (mycvData as { projects_and_activities?: Array<{ project: string; role: string; location?: string; period?: { start: string; end: string }; details?: string[] }> }).projects_and_activities ?? [];
  const skillObj = (mycvData as { skills?: Record<string, string[]> }).skills ?? {};
  const skills = Object.values(skillObj).flat().filter(Boolean);

  return {
    profile: {
      name: p?.name_kr || p?.name_en || "—",
      title: p?.title || "",
      summary: p?.summary || "",
      email: contact.email,
      phone: contact.phone,
      location: getLocation(contact),
    },
    experience: expList.map((e) => ({
      company: e.company,
      role: e.role,
      period: formatPeriod(e.period),
      highlights: (e.highlights ?? []).map((h) => ({ text: h })),
    })),
    projects: projList.map((pr) => ({
      project: pr.project,
      role: pr.role,
      period: formatPeriod(pr.period),
      details: pr.details ?? [],
    })),
    education: edu
      ? {
          university: edu.university ?? "",
          major: [edu.major, edu.double_major].filter(Boolean).join(" / "),
          period: formatPeriod(edu.period),
        }
      : null,
    skills,
    certifications: [],
  };
}

/** AI-optimized resume from fixedcv */
export function getResumeDisplayOptimized(): ResumeDisplayData {
  const p = fixedcvRaw?.profile;
  const contact = p?.contact ?? {};
  const edu = fixedcvRaw?.education;
  const expList = fixedcvRaw?.experience ?? [];
  const projList = fixedcvRaw?.projects_and_activities ?? [];
  const skillObj = fixedcvRaw?.skills ?? {};
  const skills = Object.values(skillObj).flat().filter(Boolean);

  return {
    profile: {
      name: p?.name_kr || p?.name_en || "—",
      title: p?.title || "",
      summary: p?.summary || "",
      email: contact.email,
      phone: contact.phone,
      location: getLocation(contact),
    },
    experience: expList.map((e) => ({
      company: e.company,
      role: e.role,
      period: formatPeriod(e.period),
      highlights: (e.highlights ?? []).map((h) => ({ text: h })),
    })),
    projects: projList.map((pr) => ({
      project: pr.project,
      role: pr.role,
      period: formatPeriod(pr.period),
      details: pr.details ?? [],
    })),
    education: edu
      ? {
          university: edu.university ?? "",
          major: [edu.major, edu.double_major].filter(Boolean).join(" / "),
          period: formatPeriod(edu.period),
        }
      : null,
    skills,
    certifications: [],
  };
}
