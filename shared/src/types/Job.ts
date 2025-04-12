export interface Job {
    id?: number;
    company: string;
    job_title: string;
    description: string;
    location: string;
    status: string;
    applied: Date | null;
    last_updated: Date | null;
}