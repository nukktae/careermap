/**
 * Centralized Track module types and mock data.
 * Applications persisted in localStorage; insights mock.
 */

import { getJobById } from "./jobs";

export type ApplicationStatus =
  | "interested"
  | "applied"
  | "resume_passed"
  | "interview"
  | "final";

export type ApplicationOutcome = "offer" | "rejected";

export interface Application {
  id: string;
  jobId: number;
  status: ApplicationStatus;
  addedAt: number;
  appliedAt?: number;
  updatedAt?: number;
  hasNotes: boolean;
  outcome?: ApplicationOutcome;
}

export interface TimelineEvent {
  id: string;
  status: ApplicationStatus;
  date: number;
  label?: string;
}

export interface ApplicationContact {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface ApplicationReminder {
  id: string;
  label: string;
  dueAt: number;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
}

export interface ApplicationDetailData {
  notes: string;
  documents: ApplicationDocument[];
  contacts: ApplicationContact[];
  reminders: ApplicationReminder[];
  timeline: TimelineEvent[];
}

export interface InsightsData {
  matchVsSuccess: { threshold: number; interviewRate: number };
  rejectionReasons: string[];
  avgDaysToApply: number;
  applyWithinDaysRecommendation: number;
  responseRateWhenFast: number;
  skillProgress: { improvementPercent: number; periodWeeks: number; skillsAdded: string[] };
  industryBreakdown: { startupsPercent: number; midSizeInterviewRate: number };
  totalApplications: number;
}

const STORAGE_KEY = "careermap-applications";
const DETAILS_STORAGE_KEY = "careermap-application-details";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  interested: "관심있음",
  applied: "지원함",
  resume_passed: "서류 통과",
  interview: "면접",
  final: "최종",
};

const SEED_APPLICATIONS: Application[] = [
  { id: "app-1", jobId: 1, status: "interview", addedAt: Date.now() - 14 * 86400000, appliedAt: Date.now() - 12 * 86400000, updatedAt: Date.now() - 2 * 86400000, hasNotes: true },
  { id: "app-2", jobId: 2, status: "resume_passed", addedAt: Date.now() - 10 * 86400000, appliedAt: Date.now() - 8 * 86400000, hasNotes: false },
  { id: "app-3", jobId: 3, status: "applied", addedAt: Date.now() - 5 * 86400000, appliedAt: Date.now() - 3 * 86400000, hasNotes: false },
  { id: "app-4", jobId: 4, status: "interested", addedAt: Date.now() - 2 * 86400000, hasNotes: false },
  { id: "app-5", jobId: 5, status: "final", addedAt: Date.now() - 21 * 86400000, appliedAt: Date.now() - 18 * 86400000, updatedAt: Date.now() - 7 * 86400000, hasNotes: true, outcome: "rejected" },
  { id: "app-6", jobId: 6, status: "applied", addedAt: Date.now() - 4 * 86400000, appliedAt: Date.now() - 2 * 86400000, hasNotes: false },
  { id: "app-7", jobId: 1, status: "interested", addedAt: Date.now() - 1 * 86400000, hasNotes: false },
  { id: "app-8", jobId: 2, status: "resume_passed", addedAt: Date.now() - 7 * 86400000, appliedAt: Date.now() - 6 * 86400000, hasNotes: true },
  { id: "app-9", jobId: 3, status: "final", addedAt: Date.now() - 30 * 86400000, appliedAt: Date.now() - 28 * 86400000, updatedAt: Date.now() - 14 * 86400000, hasNotes: true, outcome: "offer" },
  { id: "app-10", jobId: 5, status: "interview", addedAt: Date.now() - 9 * 86400000, appliedAt: Date.now() - 7 * 86400000, hasNotes: false },
];

function loadApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveApplications(SEED_APPLICATIONS);
      applicationsCache = [...SEED_APPLICATIONS];
      return [...SEED_APPLICATIONS];
    }
    const parsed = JSON.parse(raw) as Application[];
    const list = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SEED_APPLICATIONS];
    if (list.length === 0) saveApplications(SEED_APPLICATIONS);
    return list;
  } catch {
    return [...SEED_APPLICATIONS];
  }
}

function saveApplications(applications: Application[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch {
    // ignore
  }
}

function loadDetails(): Record<string, ApplicationDetailData> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DETAILS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ApplicationDetailData>;
  } catch {
    return {};
  }
}

function saveDetails(details: Record<string, ApplicationDetailData>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DETAILS_STORAGE_KEY, JSON.stringify(details));
  } catch {
    // ignore
  }
}

let applicationsCache: Application[] | null = null;

function getApplicationsInternal(): Application[] {
  if (typeof window === "undefined") return SEED_APPLICATIONS;
  if (applicationsCache) return applicationsCache;
  const list = loadApplications();
  applicationsCache = list;
  return list;
}

export function invalidateApplicationsCache(): void {
  applicationsCache = null;
}

export function getApplications(): Application[] {
  return [...getApplicationsInternal()];
}

export function getApplicationById(id: string): Application | undefined {
  return getApplicationsInternal().find((a) => a.id === id);
}

export function getStatusLabel(status: ApplicationStatus): string {
  return STATUS_LABELS[status];
}

export function updateApplication(id: string, patch: Partial<Application>): void {
  const list = getApplicationsInternal();
  const index = list.findIndex((a) => a.id === id);
  if (index === -1) return;
  list[index] = { ...list[index]!, ...patch, updatedAt: Date.now() };
  applicationsCache = list;
  saveApplications(list);
}

export function moveApplication(id: string, newStatus: ApplicationStatus): void {
  updateApplication(id, { status: newStatus });
  if (newStatus === "applied") {
    const app = getApplicationById(id);
    if (app && !app.appliedAt) updateApplication(id, { appliedAt: Date.now() });
  }
}

export function addApplication(jobId: number, status: ApplicationStatus = "interested"): string {
  const id = "app-" + Date.now();
  const app: Application = {
    id,
    jobId,
    status,
    addedAt: Date.now(),
    hasNotes: false,
  };
  if (status === "applied") app.appliedAt = Date.now();
  const list = getApplicationsInternal();
  list.push(app);
  applicationsCache = list;
  saveApplications(list);
  return id;
}

export function deleteApplication(id: string): void {
  const list = getApplicationsInternal().filter((a) => a.id !== id);
  applicationsCache = list;
  saveApplications(list);
  const details = loadDetails();
  delete details[id];
  saveDetails(details);
}

export function getApplicationDetail(id: string): (Application & ApplicationDetailData) | undefined {
  const app = getApplicationById(id);
  if (!app) return undefined;
  const details = loadDetails()[id];
  const job = getJobById(app.jobId);
  const defaultTimeline: TimelineEvent[] = [
    { id: "t1", status: "interested", date: app.addedAt, label: "관심있음" },
  ];
  if (app.appliedAt) defaultTimeline.push({ id: "t2", status: "applied", date: app.appliedAt, label: "지원함" });
  if (app.updatedAt) defaultTimeline.push({ id: "t3", status: app.status, date: app.updatedAt, label: STATUS_LABELS[app.status] });
  defaultTimeline.sort((a, b) => a.date - b.date);

  return {
    ...app,
    notes: details?.notes ?? "",
    documents: details?.documents ?? (job ? [{ id: "d1", name: `이력서_${job.company}.pdf`, type: "resume" }, { id: "d2", name: `자소서_${job.company}.pdf`, type: "cover" }] : []),
    contacts: details?.contacts ?? [],
    reminders: details?.reminders ?? [],
    timeline: details?.timeline?.length ? details.timeline : defaultTimeline,
  };
}

export function saveApplicationDetail(id: string, data: Partial<ApplicationDetailData>): void {
  const current = loadDetails();
  const existing = current[id] ?? { notes: "", documents: [], contacts: [], reminders: [], timeline: [] };
  current[id] = { ...existing, ...data };
  saveDetails(current);
}

export function getInsightsData(applicationCount: number): InsightsData {
  return {
    matchVsSuccess: { threshold: 65, interviewRate: 70 },
    rejectionReasons: [
      "시스템 설계 경험 부족 (3회)",
      "커뮤니케이션 강화 필요 (2회)",
      "경력 부족 (1회)",
    ],
    avgDaysToApply: 5,
    applyWithinDaysRecommendation: 2,
    responseRateWhenFast: 50,
    skillProgress: {
      improvementPercent: 12,
      periodWeeks: 3,
      skillsAdded: ["Docker", "AWS"],
    },
    industryBreakdown: { startupsPercent: 70, midSizeInterviewRate: 40 },
    totalApplications: applicationCount,
  };
}

export function exportApplicationsToCSV(): string {
  const apps = getApplicationsInternal();
  const headers = ["id", "회사", "직무", "상태", "추가일", "지원일"];
  const rows = apps.map((a) => {
    const job = getJobById(a.jobId);
    return [
      a.id,
      job?.company ?? "",
      job?.title ?? "",
      STATUS_LABELS[a.status],
      new Date(a.addedAt).toLocaleDateString("ko-KR"),
      a.appliedAt ? new Date(a.appliedAt).toLocaleDateString("ko-KR") : "",
    ];
  });
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  return csv;
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "interested",
  "applied",
  "resume_passed",
  "interview",
  "final",
];
