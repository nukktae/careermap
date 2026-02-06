/**
 * Supabase-backed profile and preferences.
 * Use when user is authenticated (session exists).
 */

import { createClient } from "@/lib/supabase/client";
import type {
  Education,
  Experience,
  Project,
  UserPreferences,
  UserProfile,
} from "./profile";

export type { UserProfile, UserPreferences };

interface ProfileRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  education: unknown;
  skills: string[] | null;
  experience: unknown;
  projects: unknown;
  resume_sections: unknown;
  cover_letter_text: string | null;
  preferences: unknown;
  account_settings: unknown;
  billing_info: unknown;
  updated_at: string | null;
}

const defaultEducation: Education = {
  university: "",
  major: "",
  graduationYear: "",
  gpa: "",
};

function mapRowToProfile(row: ProfileRow): UserProfile {
  const education = (row.education as Education) ?? defaultEducation;
  const experience = (row.experience as Experience[]) ?? [];
  const projects = (row.projects as Project[]) ?? [];
  const resumeSections = (row.resume_sections as Record<string, string>) ?? {};
  return {
    name: row.name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    photoUrl: row.photo_url ?? undefined,
    education,
    skills: Array.isArray(row.skills) ? row.skills : [],
    experience,
    projects,
    resumeSections: Object.keys(resumeSections).length ? resumeSections : undefined,
    coverLetterText: row.cover_letter_text ?? undefined,
  };
}

function profileToRow(p: Partial<UserProfile>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.email !== undefined) row.email = p.email;
  if (p.phone !== undefined) row.phone = p.phone;
  if (p.photoUrl !== undefined) row.photo_url = p.photoUrl;
  if (p.education !== undefined) row.education = p.education;
  if (p.skills !== undefined) row.skills = p.skills;
  if (p.experience !== undefined) row.experience = p.experience;
  if (p.projects !== undefined) row.projects = p.projects;
  if (p.resumeSections !== undefined) row.resume_sections = p.resumeSections;
  if (p.coverLetterText !== undefined) row.cover_letter_text = p.coverLetterText;
  row.updated_at = new Date().toISOString();
  return row;
}

const defaultPreferences: UserPreferences = {
  jobTypes: ["fulltime", "intern"],
  locations: ["seoul", "remote"],
  companyTypes: ["스타트업", "대기업"],
  salaryMin: 4000,
  salaryMax: 6000,
  emailNotifications: true,
  pushNotifications: true,
  language: "ko",
};

function mapRowToPreferences(row: ProfileRow): UserPreferences {
  const prefs = (row.preferences as Partial<UserPreferences>) ?? {};
  return { ...defaultPreferences, ...prefs };
}

export async function getProfile(userId: string): Promise<UserProfile> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error || !data) {
    return {
      name: "",
      email: "",
      phone: "",
      education: defaultEducation,
      skills: [],
      experience: [],
      projects: [],
    };
  }
  return mapRowToProfile(data as ProfileRow);
}

export async function updateProfile(
  userId: string,
  patch: Partial<UserProfile>
): Promise<void> {
  const supabase = createClient();
  const row = profileToRow(patch);
  await supabase.from("profiles").update(row).eq("id", userId);
}

export async function getPreferences(userId: string): Promise<UserPreferences> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", userId)
    .single();
  if (error || !data) return defaultPreferences;
  return mapRowToPreferences(data as ProfileRow);
}

export async function updatePreferences(
  userId: string,
  patch: Partial<UserPreferences>
): Promise<void> {
  const supabase = createClient();
  const current = await getPreferences(userId);
  const next = { ...current, ...patch };
  await supabase
    .from("profiles")
    .update({ preferences: next, updated_at: new Date().toISOString() })
    .eq("id", userId);
}
