/**
 * Supabase-backed applications and application_details.
 * Use when user is authenticated.
 */

import { createClient } from "@/lib/supabase/client";
import { getJobById } from "./jobs";
import type {
  Application,
  ApplicationDetailData,
  ApplicationStatus,
  TimelineEvent,
} from "./track";
import { APPLICATION_STATUSES } from "./track";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  interested: "관심있음",
  applied: "지원함",
  resume_passed: "서류 통과",
  interview: "면접",
  final: "최종",
};

export type {
  Application,
  ApplicationDetailData,
  ApplicationStatus,
};

interface ApplicationRow {
  id: string;
  user_id: string;
  job_id: number;
  status: string;
  added_at: string;
  applied_at: string | null;
  updated_at: string | null;
  has_notes: boolean;
  outcome: string | null;
}

interface ApplicationDetailRow {
  application_id: string;
  notes: string | null;
  documents: unknown;
  contacts: unknown;
  reminders: unknown;
  timeline: unknown;
}

function toApp(row: ApplicationRow): Application {
  return {
    id: row.id,
    jobId: row.job_id,
    status: row.status as ApplicationStatus,
    addedAt: new Date(row.added_at).getTime(),
    appliedAt: row.applied_at ? new Date(row.applied_at).getTime() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : undefined,
    hasNotes: row.has_notes,
    outcome: (row.outcome as Application["outcome"]) ?? undefined,
  };
}

export async function getApplications(userId: string): Promise<Application[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("added_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map((r) => toApp(r as ApplicationRow));
}

export async function getApplicationById(
  userId: string,
  id: string
): Promise<Application | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  if (error || !data) return null;
  return toApp(data as ApplicationRow);
}

export async function addApplication(
  userId: string,
  jobId: number,
  status: ApplicationStatus = "interested"
): Promise<string> {
  const supabase = createClient();
  const row = {
    user_id: userId,
    job_id: jobId,
    status,
    added_at: new Date().toISOString(),
    applied_at: status === "applied" ? new Date().toISOString() : null,
    has_notes: false,
  };
  const { data, error } = await supabase
    .from("applications")
    .insert(row)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return (data as { id: string }).id;
}

export async function updateApplication(
  userId: string,
  id: string,
  patch: Partial<Application>
): Promise<void> {
  const supabase = createClient();
  const row: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.appliedAt !== undefined) row.applied_at = new Date(patch.appliedAt).toISOString();
  if (patch.hasNotes !== undefined) row.has_notes = patch.hasNotes;
  if (patch.outcome !== undefined) row.outcome = patch.outcome;
  await supabase.from("applications").update(row).eq("id", id).eq("user_id", userId);
}

export async function deleteApplication(userId: string, id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("applications").delete().eq("id", id).eq("user_id", userId);
}

export async function getApplicationDetail(
  userId: string,
  id: string
): Promise<(Application & ApplicationDetailData) | null> {
  const app = await getApplicationById(userId, id);
  if (!app) return null;
  const supabase = createClient();
  const { data: detail } = await supabase
    .from("application_details")
    .select("*")
    .eq("application_id", id)
    .single();
  const job = getJobById(app.jobId);
  const defNotes = "";
  const defDocs = job
    ? [
        { id: "d1", name: `이력서_${job.company}.pdf`, type: "resume" },
        { id: "d2", name: `자소서_${job.company}.pdf`, type: "cover" },
      ]
    : [];
  const defTimeline: TimelineEvent[] = [
    { id: "t1", status: "interested", date: app.addedAt, label: "관심있음" },
  ];
  if (app.appliedAt)
    defTimeline.push({
      id: "t2",
      status: "applied",
      date: app.appliedAt,
      label: "지원함",
    });
  if (app.updatedAt)
    defTimeline.push({
      id: "t3",
      status: app.status,
      date: app.updatedAt,
      label: STATUS_LABELS[app.status],
    });
  defTimeline.sort((a, b) => a.date - b.date);

  const d = detail as ApplicationDetailRow | null;
  return {
    ...app,
    notes: d?.notes ?? defNotes,
    documents: (d?.documents as ApplicationDetailData["documents"]) ?? defDocs,
    contacts: (d?.contacts as ApplicationDetailData["contacts"]) ?? [],
    reminders: (d?.reminders as ApplicationDetailData["reminders"]) ?? [],
    timeline: (d?.timeline as ApplicationDetailData["timeline"])?.length
      ? (d!.timeline as ApplicationDetailData["timeline"])
      : defTimeline,
  };
}

export async function saveApplicationDetail(
  userId: string,
  applicationId: string,
  data: Partial<ApplicationDetailData>
): Promise<void> {
  const existing = await getApplicationDetail(userId, applicationId);
  if (!existing) return;
  const supabase = createClient();
  const row = {
    notes: data.notes ?? existing.notes,
    documents: data.documents ?? existing.documents,
    contacts: data.contacts ?? existing.contacts,
    reminders: data.reminders ?? existing.reminders,
    timeline: data.timeline ?? existing.timeline,
  };
  await supabase
    .from("application_details")
    .upsert(
      { application_id: applicationId, ...row },
      { onConflict: "application_id" }
    );
}

export { APPLICATION_STATUSES, STATUS_LABELS };
