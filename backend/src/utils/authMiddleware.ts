import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON!;
const adminEmail = process.env.ADMIN_EMAIL;

// Flexible middleware that can handle both regular auth and admin-only access
export const createAuthMiddleware = (requireAdmin: boolean = false) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Missing or invalid token" });
        return;
      }

      const token = authHeader.split(" ")[1];
      const supabase = createClient(supabaseUrl, supabaseKey);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (requireAdmin && user.email !== adminEmail) {
        res.status(403).json({ error: "Admin access required" });
        return;
      }

      (req as any).supabaseUser = user;
      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  };
};
