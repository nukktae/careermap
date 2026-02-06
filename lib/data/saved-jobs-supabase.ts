/**
 * Supabase-backed saved jobs. Use when user is authenticated.
 */

import { createClient } from "@/lib/supabase/client";

export interface SavedJobEntry {
  jobId: number;
  savedAt: number;
}

export async function getSavedJobs(userId: string): Promise<SavedJobEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("job_id, saved_at")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map((r: { job_id: number; saved_at: string }) => ({
    jobId: r.job_id,
    savedAt: new Date(r.saved_at).getTime(),
  }));
}

export async function isJobSaved(userId: string, jobId: number): Promise<boolean> {
  const supabase = createClient();
  const { count } = await supabase
    .from("saved_jobs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("job_id", jobId);
  return (count ?? 0) > 0;
}

export async function toggleSavedJob(
  userId: string,
  jobId: number
): Promise<boolean> {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", userId)
    .eq("job_id", jobId)
    .maybeSingle();
  if (existing) {
    await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", userId)
      .eq("job_id", jobId);
    return false;
  }
  await supabase.from("saved_jobs").insert({
    user_id: userId,
    job_id: jobId,
    saved_at: new Date().toISOString(),
  });
  return true;
}
