import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobs";
import dotenv from "dotenv";
import { createDatabase, addDemoData, createTables } from "./routes/jobs";

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

const initDatabase = async () => {
  try {
    const dbResult = await createDatabase();
    const tablesResult = await createTables();
    const demoResult = await addDemoData();

    return {
      db: dbResult,
      tables: tablesResult,
      demo: demoResult,
    };
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

initDatabase().then((results) => {
  console.log("Database setup complete:", results);
}).catch((error) => {
  console.error("Error during database setup:", error);
});

if (process.env.NODE_ENV !== "lambda") {
  const port = process.env.API_PORT || 4444;
  app.listen(port, () => {
    console.log(`Job Trackr backend running on port: ${port}`);
  });
}

export default app;
