export interface Job {
    id?: number;
    company: string;
    job_title: string;
    description: string;
    location: string;
    status: string;
    applied: string | null;
    last_updated: string | null;
}