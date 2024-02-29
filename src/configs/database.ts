import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

const config: PoolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  max: 20,
};

const pool = new Pool(config);

// Database pool health check
export const poolHeathCheck = async (): Promise<boolean> => {
  try {
    // Test query
    await pool.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("Database health check failed: ", error);
    return false;
  }
};

export default pool;
