import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV ?? "development";
const envPath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: envPath });

const config: PoolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  max: 20,
};

const pool = new Pool(config);

export const checkConnection = async () => {
  pool.connect((err, client, release) => {
    if (err) {
      console.error("Failed to connect to PostgreSQL:", err.stack);
    } else {
      console.log("Connected to PostgreSQL database");
      release();
    }
  });
};

checkConnection();
export default pool;
