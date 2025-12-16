import sqlite3 from "sqlite3";
import { Job } from "../types/Job"

export const execute = (db: sqlite3.Database, sql: string) => {
    return new Promise<boolean>((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

export const fetchAll = async (db: sqlite3.Database, sql: string) : Promise<Job[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, (err: string, rows:Job[]) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

export const getAllJobsById = async (db: sqlite3.Database, user_id: string) : Promise<Job[]> => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM jobs WHERE supabase_id = ?", [user_id], (err: string, rows:Job[]) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

export const insertJob = (db: sqlite3.Database, jobData: Job, user_id: string) => {
    const sql = `
        INSERT INTO jobs (company, job_title, description, location, status, applied, last_updated, supabase_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    
    const sqlValues = [
        jobData.company,
        jobData.job_title,
        jobData.description,
        jobData.location,
        jobData.status,
        jobData.applied,
        jobData.last_updated,
        user_id
    ];

    return new Promise<Job>((resolve, reject) => {
        db.run(sql, sqlValues, function (err) {
            if (err) {
                reject(err);
            } else {
                // "this" in this callback is the statement object
                // lastID is the auto-increment primary key SQLite assigned
                jobData.id = this.lastID;
                resolve(jobData);
            }
        });
    });
};

export const modifyJob = (db: sqlite3.Database, jobData: Job, user_id: string) => {
    const sql = `
        UPDATE jobs
        SET 
            company = ?,
            job_title = ?,
            description = ?,
            location = ?,
            status = ?,
            applied = ?,
            last_updated = ?
        WHERE id = ? AND supabase_id = ?;
    `;

    const sqlValues = [
        jobData.company,
        jobData.job_title,
        jobData.description,
        jobData.location,
        jobData.status,
        jobData.applied,
        jobData.last_updated,
        jobData.id,
        user_id
    ];

    return new Promise<boolean>((resolve, reject) => {
        db.run(sql, sqlValues, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

export const deleteJob = (db: sqlite3.Database, jobId: number, user_id: string) => {
    const sql = `
        DELETE FROM jobs
        WHERE id = ? AND supabase_id = ?;
    `;

    const sqlValues = [
        jobId,
        user_id
    ];

    return new Promise<boolean>((resolve, reject) => {
        db.run(sql, sqlValues, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};