import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import jobRoutes from "./routes/jobs";
import { execute } from "./utils/sql_functions";
import { MOCK_API_GET_ALL_JOBS } from "./mock_data/mockApiGetAllJobs";
import { Job } from "./types/Job";
import dotenv from "dotenv";

dotenv.config();

const filename = process.env.SQLITE_FILENAME || "./jobtracker.sqlite";
const port = process.env.API_PORT || 4444;
const app = express();

const allowedOrigins = [
  "https://jobtrackr.online",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server & curl requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/jobs", jobRoutes);

// ---------------------------------------------------------------

app.get("/createtables", async (req: Request, res: Response) => {
  const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
  const job_table = `
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT,
      job_title TEXT,
      description TEXT,
      location TEXT,
      status TEXT,
      applied DATE,
      last_updated DATE
      supabase_id TEXT
    );`;

  // const actions_table = `
  //   CREATE TABLE IF NOT EXISTS actions (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     action TEXT,
  //     description TEXT,
  //     date DATE
  //   );`;

  // const users_table = `
  //   CREATE TABLE IF NOT EXISTS users (
  //       id TEXT PRIMARY KEY,
  //       email TEXT UNIQUE NOT NULL,
  //       email_verified BOOLEAN DEFAULT 0,
  //       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  //   );`;

  try {
    await execute(db, job_table);
    // await execute(db, actions_table);
    // await execute(db, users_table);
    res.json({ message: "Tables created successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    db.close();
  }
});

app.get("/resettables", async (req: Request, res: Response) => {
  const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
  const jobs_delete = `DELETE FROM jobs; DELETE FROM SQLITE_SEQUENCE WHERE NAME='jobs';`;
  const actions_delete = `DELETE FROM actions; DELETE FROM SQLITE_SEQUENCE WHERE NAME='actions';`;
  const data = JSON.parse("");

  const sql = `
    INSERT INTO jobs (company, job_title, description, location, status, applied, last_updated, supabase_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

  try {
    await execute(db, jobs_delete);
    await execute(db, actions_delete);

    db.serialize(() => {
      const stmt = db.prepare(sql);
      data.forEach((job: Job) => {
        stmt.run(
          job.company,
          job.job_title,
          job.description,
          job.location,
          job.status,
          job.applied,
          job.last_updated,
          job.supabase_id
        );
      });
      stmt.finalize();
    });

    res.json({ message: "Tables reset successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    db.close();
  }
});

app.get("/mockdata", async (req: Request, res: Response) => {
  const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
  const data: Job[] = MOCK_API_GET_ALL_JOBS;

  const sql = `
    INSERT INTO jobs (company, job_title, description, location, status, applied, last_updated, supabase_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

  try {
    db.serialize(() => {
      const stmt = db.prepare(sql);

      data.forEach((job: Job) => {
        stmt.run(
          job.company,
          job.job_title,
          job.description,
          job.location,
          job.status,
          job.applied?.toString(),
          job.last_updated?.toString(),
          job.supabase_id
        );
      });

      stmt.finalize();
    });
    res.json({ message: "Successfully mocked data" });
  } catch (err) {
    res.status(500).json({ error: err });
  } finally {
    db.close();
  }
});

// ---------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
