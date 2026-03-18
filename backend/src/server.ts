import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobs";
import dotenv from "dotenv";
import { createDatabase, addDemoData, createTables } from "./routes/jobs";
const pkg = require("../package.json");

dotenv.config();

const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_ANON", "ADMIN_EMAIL"];

const optionalEnvVars = ["API_PORT", "SQLITE_FILENAME", "NODE_ENV"];

const validateEnvironment = () => {
  const missingVars: string[] = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error("\nMissing required environment variables:");
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error(
      "\nPlease set these environment variables and restart the server.",
    );
    process.exit(1);
  }

  console.log(
    `\nAll required environment variables are set: ${requiredEnvVars.filter((varName) => process.env[varName]).join(", ")}`,
  );

  const setOptionalVars = optionalEnvVars.filter(
    (varName) => process.env[varName],
  );
  if (setOptionalVars.length > 0) {
    console.log(
      "Optional environment variables set:",
      setOptionalVars.join(", "),
    );
  }
};

validateEnvironment();

const app = express();

const corsOptions = {
  origin: [
    "https://dev.jobtrackr.online",
    "https://jobtrackr.online",
    "http://localhost:5173",
    "http://100.116.33.88:5173",
    "http://192.168.1.14:5173",
  ],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/jobs", jobRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    version: pkg.version,
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime().toFixed(0) + "s",
  });
});

const initDatabase = async () => {
  try {
    const dbResult = await createDatabase();
    const tablesResult = await createTables();
    //const demoResult = await addDemoData();

    return {
      db: dbResult,
      tables: tablesResult,
      //demo: demoResult,
    };
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

initDatabase()
  .then((results) => {
    console.log("Database setup complete:\n", results);
  })
  .catch((error) => {
    console.error("Error during database setup:\n", error);
  });

if (process.env.NODE_ENV !== "lambda") {
  const port = process.env.API_PORT || 4444;
  app.listen(port, () => {
    console.log(`Job Trackr backend running on port: ${port}\n`);
  });
}

export default app;
