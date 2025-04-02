import express, { Request, Response } from 'express';
import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const app = express();
const port = process.env.API_PORT || 4444;
const filename = process.env.SQLITE_FILENAME || "jobtracker.sqlite";

interface Job {
    id: number;
    company: string;
    job_title: string;
    description: string;
    location: string;
    status: string;
    applied: string | null;
    last_updated: string | null;
}

const execute = (db: sqlite3.Database, sql: string) => {
    return new Promise<void>((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const fetchAll = async (db: any, sql: string) : Promise<Job[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, (err: string, rows:Job[]) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

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

    try {
        await execute(db, jobs_delete);
        await execute(db, actions_delete);
        res.send(JSON.stringify({ message: "Tables reset successfully" }, null, 2));
    } catch (error:any) {
        res.status(500).send(JSON.stringify({ error: error.message }, null, 2));
    } finally {
        db.close();
    }
});

app.get('/all', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
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
