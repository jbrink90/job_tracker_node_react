import { Router, Request, Response, NextFunction } from 'express';
import sqlite3 from "sqlite3";
import { Job } from "../types/Job";
import { openDatabase, insertJob, modifyJob, deleteJob, getAllJobsById, execute, fetchAll } from "../utils/sql_functions";
import { supabaseAuthMiddleware } from "../utils/supabaseAuth";
import { MOCK_API_GET_ALL_JOBS } from "../mock_data/mockApiGetAllJobs";
import { HttpError } from '../utils/http_error';
import axios from "axios";
import * as cheerio from "cheerio";
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

// LinkedIn job scraping function
const extractLinkedInJob = async (url: string) => {
  console.log("Fetching:", url);
  
  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  console.log("Final URL:", res.request.res.responseUrl);
  console.log("Status:", res.status);
  
  const $ = cheerio.load(res.data);
  
  console.log("Page title:", $("title").text());

  const jsonLd = $('script[type="application/ld+json"]').html();
  if (jsonLd) {
    try {
      const structuredData = JSON.parse(jsonLd);
      console.log("Found structured data:", structuredData);
    } catch (e) {
      console.log("Failed to parse JSON-LD");
    }
  }

  const cleanText = (text: string) => {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '')
      .replace(/Show more|Show less/g, '')
      .trim();
  };

  return {
    title: cleanText($("h1").first().text().trim() || $('[data-test="job-title"]').text().trim()),
    company: cleanText($('[data-test="job-company"]').text().trim() || 
             $('a[href*="/company/"]').first().text().trim()),
    location: cleanText($('[data-test="job-location"]').text().trim() || 
             $('.job-location').text().trim()),
    description: cleanText($('[data-test="job-description"]').text().trim() ||
                $('.description').text().trim()),
    salary: cleanText($('[data-test="job-salary"]').text().trim() ||
            $('span:contains("$")').first().text().trim()),
  };
};

export const createDatabase = (): Promise<{ message: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (fs.existsSync(filename)) {
        return resolve({ message: "Database already exists" });
      }

      const db = await new Promise<sqlite3.Database>((res, rej) => {
        const instance = new sqlite3.Database(
          filename,
          sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
          (err) => {
            if (err) return rej(err);
            res(instance);
          }
        );
      });

      await new Promise<void>((res, rej) => {
        db.close((err) => {
          if (err) return rej(err);
          res();
        });
      });

      resolve({ message: "Database created successfully" });

    } catch (err: any) {
      reject(new HttpError(500, err.message));
    }
  });
};


export const createTables = async () => {
  return new Promise(async (resolve, reject) => {

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
  
      resolve({ message: "Tables created successfully" });
  
    } catch (err: any) {
      reject(new HttpError(500, err.message));
    } finally {
      if (db) {
        db.close((err) => {
          if (err) console.error("DB close failed:", err);
        });
      }
    }
  });
  };

export const addDemoData = async () => {
  return new Promise(async (resolve, reject) => {
    let db: sqlite3.Database | null = null;
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
      reject(new HttpError(500, err.message));
    } finally {
      if (db) {
        db.close((err) => {
          if (err) console.error("DB close failed:", err);
        });
      }
    }
  });
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


router.get("/createdatabase", supabaseAuthMiddleware, async (req: Request, res: Response) => {
  res.json(await createDatabase());
});
router.get("/createtable", supabaseAuthMiddleware, async (req: Request, res: Response) => {
  res.json(await createTables());
});
router.get("/mockdata", supabaseAuthMiddleware, async (req: Request, res: Response) => {
  res.json(await addDemoData());
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

router.post("/pull", async (req: Request, res: Response, next: NextFunction) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: "LinkedIn job URL is required" });
  }
  
  if (!url.includes("linkedin.com/jobs")) {
    return res.status(400).json({ error: "Only LinkedIn job URLs are supported" });
  }
  
  try {
    const scrapedJob = await extractLinkedInJob(url);
    
    if (!scrapedJob.title || !scrapedJob.company) {
      return res.status(400).json({ error: "Could not extract job title or company" });
    }
    
    res.json({
      success: true,
      job: {
        job_title: scrapedJob.title,
        company: scrapedJob.company,
        location: scrapedJob.location,
        description: scrapedJob.description,
        salary: scrapedJob.salary
      }
    });
  } catch (error: any) {
    console.error("Scraping error:", error.message);
    res.status(500).json({ 
      error: "Failed to scrape job data", 
      details: error.message 
    });
  }
});
  

  
export default router;