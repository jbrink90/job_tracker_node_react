import { Router, Request, Response, NextFunction } from 'express';
import sqlite3 from "sqlite3";
import { Job } from "../types/Job";
import { openDatabase, insertJob, modifyJob, deleteJob, getAllJobsById, execute, fetchAll } from "../utils/sql_functions";
import { supabaseAuthMiddleware } from "../utils/supabaseAuth";
import { MOCK_API_GET_ALL_JOBS } from "../mock_data/mockApiGetAllJobs";
import { HttpError } from '../utils/http_error';
const fs = require('fs');

const filename = process.env.SQLITE_FILENAME || "./job_data.sqlite";
const router = Router();

const decodeJwt = (token: string): any => {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    return JSON.parse(payloadJson);
}

const getAuthBearer = (req: Request): string | null => {
    const authHeader = req.headers.authorization?.split(" ") || [];
    if (authHeader[0] !== "Bearer") return null;
    const token = authHeader[1];
    const payload = decodeJwt(token);
    const user_id = payload.sub;
    return user_id || null;
};


export const createDatabase = async (next?: NextFunction): Promise<{ message: string } | void> => {
  try {
    if (fs.existsSync(filename)) {
      return { message: "Database already exists" };
    }

    await new Promise<void>((resolve, reject) => {
      const db = new sqlite3.Database(filename, sqlite3.OPEN_CREATE, (err) => {
        if (err) return reject(err);
        db.close((closeErr) => {
          if (closeErr) return reject(closeErr);
          resolve();
        });
      });
    });

    return { message: "Database created successfully" };

  } catch (err: any) {
    const httpErr = new HttpError(500, err.message);
    if (next) {
      next(httpErr);
    } else {
      throw httpErr;
    }
  }
};

export const createTables = async (next?: NextFunction) => {
    let db: sqlite3.Database | null = null;
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
      db = await openDatabase();
      await execute(db, create_sql);
  
      return { message: "Tables created successfully" };
  
    } catch (err: any) {
      const httpErr = new HttpError(500, err.message);
      if (next) {
        next(httpErr);
      } else {
        throw httpErr;
      }
    } finally {
      if (db) {
        db.close((err) => {
          if (err) console.error("DB close failed:", err);
        });
      }
    }
  };

export const addDemoData = async (next?: NextFunction) => {
  let db: sqlite3.Database | null = null;

  //const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
  
    try {
      db = await openDatabase();


      db.serialize(() => {
        if (!db) {
          throw new HttpError(500, "Failed to open database");
        }
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
  
      return ({ message: "Successfully mocked data" });
    } catch (err: any) {
      const httpErr = new HttpError(500, err.message);
      if (next) {
        next(httpErr);
      } else {
        throw httpErr;
      }
    } finally {
      if (db) {
        db.close((err) => {
          if (err) console.error("DB close failed:", err);
        });
      }
    }
};

router.post('/', supabaseAuthMiddleware, async (req: Request, res: Response) => {
    const user_id = getAuthBearer(req);
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    if (!user_id) {
        throw new HttpError(401, "Unauthorized");
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
        throw new HttpError(401, "Unauthorized");
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
        throw new HttpError(40, "Missing id parameter");
        return;
    }

    if (!user_id) {
        throw new HttpError(401, "Unauthorized");
        return;
    }

    try {
        await deleteJob(db, parseInt(id as string, 10), user_id);
        res.json({ message: "Job: '" + id + "' deleted successfully" });
    } catch (error: any) {
        throw new HttpError(500,  error.message);
    } finally {
        db.close();
    }
});

router.get('/', supabaseAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).supabaseUser;
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY);
  
    try {
      const jobs: Job[] = await getAllJobsById(db, user.id);
      res.json(jobs);
    } catch (error: any) {
        next(error.message);
    } finally {
      db.close();
    }
});

router.get('/all', supabaseAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY);
  
    try {
      const jobs: Job[] = await fetchAll(db);
      res.json(jobs);
    } catch (error: any) {
        next(error.message);
    } finally {
      db.close();
    }
});


router.get("/createdatabase", supabaseAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  res.json(await createDatabase(next));
});
router.get("/createtable", supabaseAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  res.json(await createTables(next));
});
router.get("/mockdata", supabaseAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  res.json(await addDemoData(next));
});
  
router.get("/resettable", supabaseAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
  
    try {
      await execute(db, `DROP TABLE jobs; DELETE FROM SQLITE_SEQUENCE WHERE NAME='jobs';`);
      res.json({ message: "jobs table reset successfully" });
    } catch (error: any) {
      next(error.message);
    } finally {
      db.close();
    }
});
  

  
export default router;