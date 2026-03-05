import { Request, Response, NextFunction } from "express";

const adminEmail = process.env.ADMIN_EMAIL;

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).supabaseUser;
    
    if (!user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    if (user.email !== adminEmail) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    next();
  } catch (err) {
    console.error("Admin auth middleware error:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
