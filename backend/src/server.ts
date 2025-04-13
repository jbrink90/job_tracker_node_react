import express, { Request, Response } from 'express';
import sqlite3 from "sqlite3";
import cors from 'cors';
import jobRoutes from './routes/jobs';
import {execute} from "./utils/sql_functions";
import {mockApiResponseAll} from "@mocks/mockApiResponseAll"
import {Job} from "@mytypes/Job"


const filename = process.env.SQLITE_FILENAME || "./jobtracker.sqlite";
const port = process.env.API_PORT || 4444;
const app = express();

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(cors());
app.use(express.json());

app.use('/jobs', jobRoutes);

// ---------------------------------------------------------------

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

    const users_table = `
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        email_verified BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`;

    try {
        await execute(db, job_table);
        await execute(db, actions_table);
        await execute(db, users_table);
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
    const data = JSON.parse("");

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
    //const data = mockApiResponseAll;

    const data: Job[] = mockApiResponseAll;

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
                    job.applied?.toString(),
                    job.last_updated?.toString()
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

// ---------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});