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

export default pool;
