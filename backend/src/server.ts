import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobs";
import dotenv from "dotenv";
import { createDatabase } from "./routes/jobs";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true, 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());
app.use("/jobs", jobRoutes);
createDatabase();

if (process.env.NODE_ENV !== "lambda" && process.env.NODE_ENV !== "production") {
  const port = process.env.API_PORT || 4444;
  app.listen(port, () => {
    console.log(`Job Trackr backend running on port: ${port}`);
  });
}

export default app;
