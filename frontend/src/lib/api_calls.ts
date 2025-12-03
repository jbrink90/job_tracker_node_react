// lib/api_calls.ts
import { Job } from "@mytypes/Job";

export async function apiGetJobs(): Promise<Job[]> {
  const res = await fetch("/api/jobs");
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function apiAddJob(job: Job): Promise<Job> {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error("Failed to add job");
  return res.json();
}

export async function apiDeleteJob(job: Job): Promise<void> {
  const res = await fetch("/api/jobs", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error("Failed to delete job");
}

export async function apiSaveJob(job: Job): Promise<void> {
  const res = await fetch("/api/jobs", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error("Failed to save job");
}