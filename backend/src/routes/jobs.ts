import { Router, Request, Response, NextFunction } from "express";
import sqlite3 from "sqlite3";
import { Job } from "../types/Job";
import {
  openDatabase,
  insertJob,
  modifyJob,
  deleteJob,
  getAllJobsById,
  execute,
  fetchAll,
} from "../utils/sql_functions";
import { createAuthMiddleware } from "../utils/authMiddleware";
import { MOCK_API_GET_ALL_JOBS } from "../mock_data/mockApiGetAllJobs";
import { HttpError } from "../utils/http_error";
import axios from "axios";
import * as cheerio from "cheerio";
const fs = require("fs");

const filename = process.env.SQLITE_FILENAME || "./job_data.sqlite";
const router = Router();

const validateJobData = (data: any): Job => {
  const job: Job = {
    id: data.id || null,
    company: data.company || "",
    job_title: data.job_title || "",
    description: data.description || "",
    location: data.location || "",
    status: data.status || "",
    applied: data.applied ? new Date(data.applied) : new Date(),
    last_updated: data.last_updated ? new Date(data.last_updated) : new Date(),
    supabase_id: data.supabase_id || "",
  };

  if (!job.supabase_id) {
    throw new HttpError(400, "supabase_id is required");
  }
  if (!job.company) {
    throw new HttpError(400, "company is required");
  }
  if (!job.job_title) {
    throw new HttpError(400, "job_title is required");
  }
  if (!job.last_updated) {
    throw new HttpError(400, "last_updated is required");
  }

  return job;
};

const decodeJwt = (token: string): any => {
  const payloadBase64 = token.split(".")[1];
  const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
  return JSON.parse(payloadJson);
};

const getAuthBearer = (req: Request): string | null => {
  const authHeader = req.headers.authorization?.split(" ") || [];
  if (authHeader[0] !== "Bearer") return null;
  const token = authHeader[1];
  const payload = decodeJwt(token);
  const user_id = payload.sub;
  return user_id || null;
};

const extractLinkedInJob = async (url: string) => {
  const res = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  const $ = cheerio.load(res.data);

  const jsonLd = $('script[type="application/ld+json"]').html();
  if (jsonLd) {
    try {
      const structuredData = JSON.parse(jsonLd);
    } catch (e) {
      console.error("Failed to parse JSON-LD", e);
    }
  }

  const cleanText = (text: string) => {
    return text
      .replace(/\s+/g, " ")
      .replace(/\n\s+/g, "")
      .replace(/Show more|Show less/g, "")
      .trim();
  };

  const htmlToMarkdown = (html: string) => {
    return (
      html
        // Remove comment nodes
        .replace(/<!---->/g, "")
        // Convert <strong> and <b> to markdown bold
        .replace(/<(?:strong|b)>(.*?)<\/(?:strong|b)>/g, "**$1**")
        // Convert <em> and <i> to markdown italic
        .replace(/<(?:em|i)>(.*?)<\/(?:em|i)>/g, "*$1*")
        // Convert <ul> to markdown lists (remove opening tag)
        .replace(/<ul[^>]*>/g, "")
        // Convert </ul> to just newlines
        .replace(/<\/ul>/g, "\n")
        // Convert <ol> to markdown numbered lists
        .replace(/<ol[^>]*>/g, "")
        .replace(/<\/ol>/g, "\n")
        // Convert <li> to markdown list items
        .replace(/<li[^>]*>(.*?)<\/li>/g, "- $1\n")
        // Convert <br> and <br/> to newlines
        .replace(/<br\s*\/?>/g, "\n")
        // Convert <p> and </p> to newlines
        .replace(/<p[^>]*>/g, "")
        .replace(/<\/p>/g, "\n\n")
        // Convert <h1>-<h6> to markdown headers
        .replace(/<h1[^>]*>(.*?)<\/h1>/g, "# $1\n\n")
        .replace(/<h2[^>]*>(.*?)<\/h2>/g, "## $1\n\n")
        .replace(/<h3[^>]*>(.*?)<\/h3>/g, "### $1\n\n")
        .replace(/<h4[^>]*>(.*?)<\/h4>/g, "#### $1\n\n")
        .replace(/<h5[^>]*>(.*?)<\/h5>/g, "##### $1\n\n")
        .replace(/<h6[^>]*>(.*?)<\/h6>/g, "###### $1\n\n")
        // Remove any remaining HTML tags
        .replace(/<[^>]*>/g, "")
        // Clean up whitespace
        .replace(/\n\s*\n\s*\n/g, "\n\n") // Normalize multiple newlines
        .replace(/^\s+|\s+$/gm, "") // Trim lines
        .trim()
    );
  };

  const extractDescriptionMarkdown = () => {
    // Try to get the inner content of the description div
    const descriptionDiv = $(".show-more-less-html__markup").first();
    if (descriptionDiv.length) {
      return htmlToMarkdown(descriptionDiv.html() || "");
    }

    // Fallback to other methods
    const fallbackHtml =
      $('[data-test="job-description"]').html() ||
      $(".description__text").html() ||
      $(".show-more-less-html__markup").html() ||
      "";
    return htmlToMarkdown(fallbackHtml);
  };

  const titleText = $("title").text();

  let location = "";

  const titleMatch = titleText.match(/^(.+?)\s+in\s+(.+?)\s*\|/);
  if (titleMatch && titleMatch[2]) {
    location = titleMatch[2].trim();
  }

  if (!location) {
    location =
      $('[class*="location"]:not([class*="typeahead"])')
        .first()
        .text()
        .trim() ||
      $(".topcard__flavor--bullet-location-v2").first().text().trim() ||
      $('[data-test="job-location"]').first().text().trim() ||
      "";
  }

  return {
    title: cleanText(
      $("h1").first().text().trim() ||
        $('[data-test="job-title"]').text().trim(),
    ),
    company: cleanText(
      $('[data-test="job-company"]').text().trim() ||
        $('a[href*="/company/"]').first().text().trim(),
    ),
    location: cleanText(
      location.split("\n")[0].split(",")[0].split("·")[0].trim(),
    ),
    description: extractDescriptionMarkdown(),
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
          },
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
            job.supabase_id,
          );
        });

        stmt.finalize();
        db.run("COMMIT;");
      });

      return { message: "Successfully mocked data" };
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

router.post(
  "/",
  createAuthMiddleware(false),
  async (req: Request, res: Response) => {
    const user = (req as any).supabaseUser;
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    if (!user) {
      throw new HttpError(401, "Unauthorized");
      return;
    }

    try {
      // Add user ID to job data
      const jobDataWithUserId = { ...jobData, supabase_id: user.id };

      // Validate and sanitize job data
      const validatedJob = validateJobData(jobDataWithUserId);
      const insertedJob = await insertJob(db, validatedJob, user.id);
      res.json(insertedJob);
    } catch (error: any) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    } finally {
      db.close();
    }
  },
);

router.patch(
  "/",
  createAuthMiddleware(false),
  async (req: Request, res: Response) => {
    const user = (req as any).supabaseUser;
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    if (!user) {
      throw new HttpError(401, "Unauthorized");
      return;
    }

    try {
      // Add user ID to job data
      const jobDataWithUserId = { ...jobData, supabase_id: user.id };

      // Validate and sanitize job data
      const validatedJob = validateJobData(jobDataWithUserId);
      await modifyJob(db, validatedJob, user.id);
      res.json({
        message: "Job: '" + validatedJob.job_title + "' modified successfully",
      });
    } catch (error: any) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    } finally {
      db.close();
    }
  },
);

router.delete(
  "/:id",
  createAuthMiddleware(false),
  async (req: Request, res: Response) => {
    const user = (req as any).supabaseUser;
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { id } = req.params;

    if (!user) {
      throw new HttpError(401, "Unauthorized");
      return;
    }

    try {
      await deleteJob(db, parseInt(id, 10), user.id);
      res.json({ message: "Job: '" + id + "' deleted successfully" });
    } catch (error: any) {
      throw new HttpError(500, error.message);
    } finally {
      db.close();
    }
  },
);

router.get(
  "/",
  createAuthMiddleware(false),
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

router.get(
  "/all",
  createAuthMiddleware(true),
  async (req: Request, res: Response, next: NextFunction) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY);

    try {
      const jobs: Job[] = await fetchAll(db);
      res.json(jobs);
    } catch (error: any) {
      next(error.message);
    } finally {
      db.close();
    }
  },
);

router.get(
  "/createdatabase",
  createAuthMiddleware(true),
  async (req: Request, res: Response) => {
    res.json(await createDatabase());
  },
);
router.get(
  "/createtable",
  createAuthMiddleware(true),
  async (req: Request, res: Response) => {
    res.json(await createTables());
  },
);
router.get(
  "/mockdata",
  createAuthMiddleware(true),
  async (req: Request, res: Response) => {
    res.json(await addDemoData());
  },
);

router.get(
  "/resettable",
  createAuthMiddleware(true),
  async (req: Request, res: Response, next: NextFunction) => {
    const db = new sqlite3.Database(
      filename,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    );

    try {
      await execute(
        db,
        `DROP TABLE jobs; DELETE FROM SQLITE_SEQUENCE WHERE NAME='jobs';`,
      );
      res.json({ message: "jobs table reset successfully" });
    } catch (error: any) {
      next(error.message);
    } finally {
      db.close();
    }
  },
);

router.post(
  "/pull",
  createAuthMiddleware(false),
  async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "LinkedIn job URL is required" });
    }

    if (!url.includes("linkedin.com/jobs")) {
      return res
        .status(400)
        .json({ error: "Only LinkedIn job URLs are supported" });
    }

    try {
      const scrapedJob = await extractLinkedInJob(url);

      if (!scrapedJob.title || !scrapedJob.company) {
        return res
          .status(400)
          .json({ error: "Could not extract job title or company" });
      }

      res.json({
        success: true,
        job: {
          job_title: scrapedJob.title,
          company: scrapedJob.company,
          location: scrapedJob.location,
          description: scrapedJob.description,
        },
      });
    } catch (error: any) {
      console.error("Scraping error:", error.message);
      res.status(500).json({
        error: "Failed to scrape job data",
        details: error.message,
      });
    }
  },
);

export default router;
