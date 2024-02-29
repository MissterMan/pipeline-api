import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { router } from "./routes/route";
// import { poolHeathCheck } from "./configs/database";

// To use env variable in this file
dotenv.config();

// Create express Application
const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
/* 
 Check is database pool healthy
 if healthy === true; start the server
 if healthy === false; return error
*/
// async function startServer() {
//   try {
//     // get health status
//     const isHealthy = await poolHeathCheck();
//     // check if pool healthy
//     if (!isHealthy) {
//       throw new Error("Database health check");
//     }
//     // start server
//     app.listen(port, () => {
//       console.log(`[server]: Server is running at http://localhost:${port}`);
//     });
//   } catch (error) {
//     console.error("Failed to start server due to:", error);
//     process.exit(1);
//   }
// }

// startServer();
