import { Router, Request, Response } from 'express';
import sqlite3 from "sqlite3";
import { Job } from "@mytypes/Job"
import {fetchAll, insertJob, modifyJob, deleteJob} from "../utils/sql_functions";

const filename = process.env.SQLITE_FILENAME || "./jobtracker.sqlite";
const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    try {
        await insertJob(db, jobData);
        res.json(jobData);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    } finally {
        db.close();
    }
});

router.patch('/', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    try {
        await modifyJob(db, jobData);
        res.json({ message: "Job: '" + jobData.job_title + "' modified successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    } finally {
        db.close();
    }
});

router.delete('/', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE);
    const { body: jobData } = req;

    try {
        await deleteJob(db, jobData);
        res.json({ message: "Job: '" + jobData.job_title + "' deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    } finally {
        db.close();
    }
});

router.get('/', async (req: Request, res: Response) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY);
    let sql = `SELECT * FROM jobs`;
  
    try {
      const jobs: Job[] = await fetchAll(db, sql);
      res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err });
    } finally {
      db.close();
    }
});

export default router;