import express, { Express } from "express";
import dotenv from "dotenv";
import { router } from "./routes/route";
import path from "path";
import pool from "./configs/database";

// To use env variable in this file
dotenv.config({
  path: path.resolve(process.cwd(), `./.env.${process.env.NODE_ENV}`),
});

// Create express Application
const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api", router);

pool.connect((err, client, release) => {
  if (err) {
    console.error("Failed to connect to PostgreSQL:", err.stack);
  } else {
    console.log("Connected to PostgreSQL database");
    release();
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
