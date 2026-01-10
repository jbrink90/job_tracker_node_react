import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobs";
import dotenv from "dotenv";
import { createDatabase } from "./routes/jobs";

dotenv.config();

const app = express();

const corsOptions = {
  origin: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(cors(corsOptions));

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
