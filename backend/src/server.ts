import express, { Request, Response } from 'express';
import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { Job } from "@mytypes/Job"
import {execute, fetchAll, insertJob, modifyJob, deleteJob} from "./utils/sql_functions";
import cors from 'cors';

const app = express();
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(express.json());

const port = process.env.API_PORT || 4444;
const filename = process.env.SQLITE_FILENAME || "jobtracker.sqlite";

app.post('/jobs', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    try {
        await insertJob(db, jobData);
        res.send(JSON.stringify({ message: "Job: '" + jobData.job_title + "' created successfully" }, null, 2));
    } catch (error: any) {
        res.status(500).send(JSON.stringify({ error: error.message }, null, 2));
    } finally {
        db.close();
    }
});

app.patch('/jobs', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    try {
        await modifyJob(db, jobData);
        res.send(JSON.stringify({ message: "Job: '" + jobData.job_title + "' modified successfully" }, null, 2));
    } catch (error: any) {
        res.status(500).send(JSON.stringify({ error: error.message }, null, 2));
    } finally {
        db.close();
    }
});

app.delete('/jobs', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    try {
        await deleteJob(db, jobData);
        res.send(JSON.stringify({ message: "Job: '" + jobData.job_title + "' deleted successfully" }, null, 2));
    } catch (error: any) {
        res.status(500).send(JSON.stringify({ error: error.message }, null, 2));
    } finally {
        db.close();
    }
});

app.get('/jobs', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY);
    let sql = `SELECT * FROM jobs`;
  
    try {
      const jobs: Job[] = await fetchAll(db, sql);
      res.send(JSON.stringify(jobs, null, 2));
    } catch (err) {
        res.status(500).send(JSON.stringify({ error: err }, null, 2));
    } finally {
      db.close();
    }
});

app.get('/createtables', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
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
    );`;

    const actions_table = `
    CREATE TABLE IF NOT EXISTS actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT,
      description TEXT,
      date DATE
    );`;

    try {
        await execute(db, job_table);
        await execute(db, actions_table);
        res.send(JSON.stringify({ message: "Tables created successfully" }, null, 2));
    } catch (error: any) {
        res.status(500).send(JSON.stringify({ error: error.message }, null, 2));
    } finally {
        db.close();
    }
});

app.get('/resettables', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const jobs_delete = `DELETE FROM jobs; DELETE FROM SQLITE_SEQUENCE WHERE NAME='jobs';`;
    const actions_delete = `DELETE FROM actions; DELETE FROM SQLITE_SEQUENCE WHERE NAME='actions';`;
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "mock_data/all_response.json"), "utf8"));

    const sql = `
    INSERT INTO jobs (company, job_title, description, location, status, applied, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?);
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
                    job.last_updated
                );
            });
            stmt.finalize();
        });

        res.send(JSON.stringify({ message: "Tables reset successfully" }, null, 2));
    } catch (error:any) {
        res.status(500).send(JSON.stringify({ error: error.message }, null, 2));
    } finally {
        db.close();
    }

});

app.get('/mockdata', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "mock_data/all_response.json"), "utf8"));

    const sql = `
    INSERT INTO jobs (company, job_title, description, location, status, applied, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?);
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
                    job.applied,
                    job.last_updated
                );
            });
    
            stmt.finalize();
        });
        res.send(JSON.stringify({message: "Successfully mocked data"}, null, 2));
    } catch (err) {
        res.status(500).send(JSON.stringify({ error: err }, null, 2));
    } finally {
        db.close();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
