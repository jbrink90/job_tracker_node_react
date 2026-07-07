// lib/api_calls.ts
import { Job } from "../types/Job";
import { supabase } from "../lib/supabase";

type LinkedInJobResponse = {
  success: boolean;
  job?: {
    job_title: string;
    company: string;
    location: string;
    description: string;
  };
  error?: string;
  details?: string;
};

export async function apiGetJobsSupabase(userId: string): Promise<Job[]> {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select()
    .eq('userId', userId);
  if (error) throw new Error("Failed to fetch jobs: " + error.message);
  return jobs || [];
}

export async function apiAddJobSupabase(
  job: Job): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select()
    .single();
  if (error) {
    throw new Error("Failed to add job: " + error.message);
  }
  return data;
}

export async function apiDeleteJobSupabase(
  jobId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("userId", userId);
  if (error) throw new Error("Failed to delete job: " + error.message);
}

export async function apiUpdateJobSupabase(
  job: Job): Promise<void> {
  const { error } = await supabase
    .from('jobs')
    .update(job)
    .eq('id', job.id)
    .eq('userId', job.userId);
  if (error) throw new Error("Failed to save job: " + error.message);
}

export async function apiPullLinkedInData(
  linkedinUrl: string,
  supabase_id: string | null,
): Promise<LinkedInJobResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/pull`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabase_id}`,
    },
    body: JSON.stringify({
      url: linkedinUrl,
    }),
  });
  return res.json();
}
