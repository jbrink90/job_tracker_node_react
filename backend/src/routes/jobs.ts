import { Router, Request, Response } from 'express';
import sqlite3 from "sqlite3";
import { Job } from "../types/Job";
import {insertJob, modifyJob, deleteJob, getAllJobsById, execute, fetchAll} from "../utils/sql_functions";
import { supabaseAuthMiddleware } from "../utils/supabaseAuth";
import { MOCK_API_GET_ALL_JOBS } from "../mock_data/mockApiGetAllJobs";

const filename = process.env.SQLITE_FILENAME || "./jobtracker.sqlite";
const router = Router();

const decodeJwt = (token: string): any => {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    return JSON.parse(payloadJson);
}

const getAuthBearer = (req: Request): string | null => {
    const authHeader = req.headers.authorization?.split(" ") || [];
    const token = authHeader[1];
    if (authHeader[0] !== "Bearer") return null;
    const payload = decodeJwt(token);
    const user_id = payload.sub;
    return user_id || null;
};

router.post('/', supabaseAuthMiddleware, async (req: Request, res: Response) => {
    const user_id = getAuthBearer(req);
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    if (!user_id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const insertedJob = await insertJob(db, jobData, user_id);
        res.json(insertedJob);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    } finally {
        db.close();
    }
});

router.patch('/', supabaseAuthMiddleware, async (req: Request, res: Response) => {
    const user_id = getAuthBearer(req);
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    if (!user_id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        await modifyJob(db, jobData, user_id);
        res.json({ message: "Job: '" + jobData.job_title + "' modified successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    } finally {
        db.close();
    }
});

router.delete('/', supabaseAuthMiddleware, async (req: Request, res: Response) => {
    const user_id = getAuthBearer(req);
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { id } = req.query;
    
    if (!id) {
        res.status(400).json({ error: "Missing id parameter" });
        return;
    }

    if (!user_id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        await deleteJob(db, parseInt(id as string, 10), user_id);
        res.json({ message: "Job: '" + id + "' deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    } finally {
        db.close();
    }
});

router.get('/', supabaseAuthMiddleware, async (req: Request, res: Response) => {
    const user = (req as any).supabaseUser;
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY);
  
    try {
      const jobs: Job[] = await getAllJobsById(db, user.id);
      res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err });
    } finally {
      db.close();
    }
});

router.get('/all', supabaseAuthMiddleware, async (req: Request, res: Response) => {
    const user = (req as any).supabaseUser;
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY);
  
    try {
      const jobs: Job[] = await fetchAll(db);
      res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err });
    } finally {
      db.close();
    }
});


router.get("/createtable", async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    const create_sql = `
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT,
        job_title TEXT,
        description TEXT,
        location TEXT,
        status TEXT,
        applied DATE,
        last_updated DATE,
        supabase_id TEXT
      );`;
  
    try {
      await execute(db, create_sql);
      res.json({ message: "jobs table created successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    } finally {
      db.close();
    }
  });
  
  router.get("/resettable", async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
  
    try {
      await execute(db, `DROP TABLE jobs; DELETE FROM SQLITE_SEQUENCE WHERE NAME='jobs';`);
      res.json({ message: "jobs table reset successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    } finally {
      db.close();
    }
  });
  
  router.get("/mockdata", async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
  
    try {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION;");
        const stmt = db.prepare(`
          INSERT INTO jobs
          (company, job_title, description, location, status, applied, last_updated, supabase_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `);
  
        MOCK_API_GET_ALL_JOBS.forEach((job: Job) => {
          stmt.run(
            job.company,
            job.job_title,
            job.description,
            job.location,
            job.status,
            job.applied?.toISOString(),
            job.last_updated?.toISOString(),
            job.supabase_id
          );
        });
  
        stmt.finalize();
        db.run("COMMIT;");
      });
  
      res.json({ message: "Successfully mocked data" });
    } catch (err) {
      res.status(500).json({ error: err });
    } finally {
      db.close();
    }
  });
  
  
  // ---------------------------------------------------------------

export default router;