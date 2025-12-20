import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobs";

import dotenv from "dotenv";

dotenv.config();

const port = process.env.API_PORT || 4444;
const app = express();

const allowedOrigins = [
  "https://jobtrackr.online",
  "http://localhost:5173",
  "http://192.168.1.14:5173",
  "http://192.168.1.14:42000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server & curl requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/jobs", jobRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
