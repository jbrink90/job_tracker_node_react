export interface Job {
  id?: string;
  company?: string;
  jobTitle?: string;
  description?: string;
  location?: string;
  status?: string;
  applied: Date | null;
  lastUpdated: Date | null;
  createdAt: Date | null;
  userId: string;
}
