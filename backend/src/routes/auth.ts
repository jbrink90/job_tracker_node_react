import { Router, Request, Response, NextFunction } from "express";
import sqlite3 from "sqlite3";
import {
  fetchAll,
  insertJob,
  modifyJob,
  deleteJob,
} from "../utils/sql_functions";
import dotenv from "dotenv";

dotenv.config();

const jwt = require("jsonwebtoken");
const filename = process.env.SQLITE_FILENAME || "./jobtracker.sqlite";
const router = Router();

router.post("/", authenticateToken, (req: Request, res: Response) => {
  console.log("/auth/ endpoint");
});

router.post("/login", async (req: Request, res: Response) => {
  console.log("/auth/login endpoint");
  const username = req.body.username;
  const password = req.body.password;
  const user = { user: username };

  //console.log(process.env.JWT_SECRET_TOKEN);
  const jwtToken = jwt.sign(user, process.env.JWT_SECRET_TOKEN);
  res.json({ accessToken: jwtToken });
});

function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const authToken = authHeader && authHeader.split(" ")[1];
  if (authToken == null) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(
    authToken,
    process.env.JWT_SECRET_TOKEN as string,
    (err: any, user: any) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      (req as any).username = user;
      next();
    }
  );
}

export default router;
