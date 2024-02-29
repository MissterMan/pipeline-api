import pool from "../configs/database";

// Get all pipeline data
export const getPipelines = async () => {
  const result = await pool.query("SELECT * FROM pipeline.pipelines");
  return result.rows;
};

// Get pipeline by ID
export const getPipelineById = async (uuid: string) => {
  const result = await pool.query(
    `SELECT * FROM pipeline.pipelines WHERE uuid = '${uuid}'`
  );
  // If there is no data return null
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows;
};
