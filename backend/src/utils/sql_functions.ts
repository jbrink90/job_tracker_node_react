import sqlite3 from "sqlite3";
import { Job } from "@mytypes/Job"

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

export const fetchAll = async (db: any, sql: string) : Promise<Job[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, (err: string, rows:Job[]) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

export const insertJob = (db: sqlite3.Database, jobData: Job) => {
    const sql = `
    INSERT INTO jobs (company, job_title, description, location, status, applied, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    
    const sqlValues = [
        jobData.company,
        jobData.job_title,
        jobData.description,
        jobData.location,
        jobData.status,
        jobData.applied,
        jobData.last_updated,
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

export const modifyJob = (db: sqlite3.Database, jobData: Job) => {
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
        WHERE id = ?;
    `;

    const sqlValues = [
        jobData.company,
        jobData.job_title,
        jobData.description,
        jobData.location,
        jobData.status,
        jobData.applied,
        jobData.last_updated,
        jobData.id
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

export const deleteJob = (db: sqlite3.Database, jobData: Job) => {
    const sql = `
        DELETE FROM jobs
        WHERE id = ?;
    `;

    const sqlValues = [
        jobData.id
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