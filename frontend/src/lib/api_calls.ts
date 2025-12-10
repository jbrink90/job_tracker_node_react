// lib/api_calls.ts
import { Job } from "@mytypes/Job";
import isDev from "../lib/is_dev";

const baseUrl =
  (isDev()
    ? import.meta.env.VITE_API_BASE_URL_DEV
    : import.meta.env.VITE_API_BASE_URL_PROD) || "http://localhost:4444";
    
/**
 * Fetch all jobs for a specific user.
 *
 * @async
 * @function
 * @param {string | null} supabase_id - The Supabase user ID to fetch jobs for. Can be null.
 * @returns {Promise<Job[]>} Resolves with an array of Job objects.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 *
 * @example
 * const jobs = await apiGetJobs('user-id-123');
 */
export async function apiGetJobs(supabase_id: string | null): Promise<Job[]> {
  const res = await fetch(`${baseUrl}/jobs`, {
    method: "GET",
    headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${supabase_id}` },
  });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

/**
 * Add a new job for a specific user.
 *
 * @async
 * @function
 * @param {Job} job - The job data to add.
 * @param {string | null} supabase_id - The Supabase user ID to associate the job with. Can be null.
 * @returns {Promise<Job>} Resolves with the newly added Job object.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 *
 * @example
 * const newJob = await apiAddJob({ company: 'Acme', job_title: 'Developer', ... }, 'user-id-123');
 */
export async function apiAddJob(job: Job, supabase_id: string | null): Promise<Job> {
  const res = await fetch(`${baseUrl}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${supabase_id}` },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error("Failed to add job");
  return res.json();
}

/**
 * Delete a job by its ID for a specific user.
 *
 * @async
 * @function
 * @param {number} jobId - The ID of the job to delete.
 * @param {string | null} supabase_id - The Supabase user ID to authorize the deletion. Can be null.
 * @returns {Promise<void>} Resolves with nothing on success.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 *
 * @example
 * await apiDeleteJob(42, 'user-id-123');
 */
export async function apiDeleteJob(jobId: number, supabase_id: string | null): Promise<void> {
  const res = await fetch(`${baseUrl}/jobs?id=${jobId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${supabase_id}` },
  });
  if (!res.ok) throw new Error("Failed to delete job");
}

/**
 * Save updates to an existing job for a specific user.
 *
 * @async
 * @function
 * @param {Job} job - The updated job data.
 * @param {string | null} supabase_id - The Supabase user ID to authorize the save. Can be null.
 * @returns {Promise<void>} Resolves with nothing on success.
 * @throws Will throw an error if the fetch fails or the response is not OK.
 *
 * @example
 * await apiSaveJob({ id: 42, company: 'Acme', job_title: 'Senior Dev', ... }, 'user-id-123');
 */
export async function apiSaveJob(job: Job, supabase_id: string | null): Promise<void> {
  const res = await fetch(`${baseUrl}/jobs`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${supabase_id}` },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error("Failed to save job");
}