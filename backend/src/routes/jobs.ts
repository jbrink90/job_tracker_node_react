import { Router, Request, Response } from 'express';
import sqlite3 from "sqlite3";
import { Job } from "@shared/types/Job";
import {fetchAll, insertJob, modifyJob, deleteJob} from "../utils/sql_functions";

const filename = process.env.SQLITE_FILENAME || "./jobtracker.sqlite";
const router = Router();

router.post('/', async (req: Request, res: Response) => {
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

router.patch('/', async (req: Request, res: Response) => {
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

router.delete('/', async (req: Request, res: Response) => {
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

router.get('/', async (req: Request, res: Response) => {
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

export default router;