import { Router, Request, Response } from 'express';
import sqlite3 from "sqlite3";
import {modifyJob, deleteJob} from "../utils/sql_functions";

const filename = process.env.SQLITE_FILENAME || "./jobtracker.sqlite";
const router = Router();

const getAuthBearer = (req: Request): string | null => {
    const authHeader = req.headers.authorization?.split(" ") || [];
    if (authHeader[0] !== "Bearer") return null;
    return authHeader[1] || null;
};

router.patch('/', async (req: Request, res: Response) => {
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

router.delete('/', async (req: Request, res: Response) => {
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

export default router;