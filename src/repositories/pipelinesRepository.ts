import pool from "../configs/database";
import Pipeline from "../models/pipelineModel";

// Get all pipeline data
export const getPipelines = async () => {
  const query = `
    SELECT 
      pipeline.pipelines.id, 
      pipeline.pipelines."uuid", 
      pipeline.pipelines.project_name, 
      user_sales."name" as sales_name,
      user_pic."name" as pic_name,
      pipeline.end_users."name" as end_user_name,
      pipeline.pipelines.product_price,
      pipeline.pipelines.service_price,
      pipeline.pipelines.margin,
      pipeline.pipelines.status,
      pipeline.project_categories."name" as categories,
      pipeline.pipelines.description,
      pipeline.pipelines.file_url,
      pipeline.pipelines.estimated_closed_date,
      pipeline.pipelines.estimated_delivered_date
    FROM 
      pipeline.pipelines
    JOIN 
      pipeline.project_categories on pipeline.pipelines.id_category_project = pipeline.project_categories.id
    JOIN 
      pipeline.pipeline_users as user_sales on pipeline.pipelines.id_user_sales = user_sales.id
    JOIN 
      pipeline.pipeline_users as user_pic on pipeline.pipelines.id_pic_project = user_pic.id
    JOIN 
      pipeline.end_users on pipeline.pipelines.id_end_user = pipeline.end_users.id 
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get pipeline by ID
export const getPipelineById = async (uuid: string) => {
  const query = `
    SELECT 
      pipeline.pipelines.id, 
      pipeline.pipelines."uuid", 
      pipeline.pipelines.project_name, 
      user_sales."name" as sales_name,
      user_pic."name" as pic_name,
      pipeline.end_users."name" as end_user_name,
      pipeline.pipelines.product_price,
      pipeline.pipelines.service_price,
      pipeline.pipelines.margin,
      pipeline.pipelines.status,
      pipeline.project_categories."name" as categories,
      pipeline.pipelines.description,
      pipeline.pipelines.file_url,
      pipeline.pipelines.estimated_closed_date,
      pipeline.pipelines.estimated_delivered_date
    FROM 
      pipeline.pipelines
    JOIN 
      pipeline.project_categories on pipeline.pipelines.id_category_project = pipeline.project_categories.id
    JOIN 
      pipeline.pipeline_users as user_sales on pipeline.pipelines.id_user_sales = user_sales.id
    JOIN 
      pipeline.pipeline_users as user_pic on pipeline.pipelines.id_pic_project = user_pic.id
    JOIN 
      pipeline.end_users on pipeline.pipelines.id_end_user = pipeline.end_users.id 
    WHERE
      pipeline.pipelines."uuid" = $1
  `;

  try {
    const result = await pool.query(query, [uuid]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows;
  } catch (error) {
    console.error("Error when query pipeline by ID:", error);
    throw error;
  }
};

export const createPipeline = async (data: Pipeline) => {
  const query = `
    INSERT INTO pipeline.pipelines (
      id_category_project,
      uuid,
      project_name,
      id_user_sales,
      id_end_user,
      id_pic_project,
      product_price,
      service_price,
      margin,
      estimated_closed_date,
      estimated_delivered_date,
      description,
      status,
      file_url,
      created_at,
      updated_at
    ) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *;`;

  const values = [
    data.id_category_project,
    data.uuid,
    data.project_name,
    data.id_user_sales,
    data.id_end_user,
    data.id_pic_project,
    data.product_price,
    data.service_price,
    data.margin,
    data.estimated_closed_date,
    data.estimated_delivered_date,
    data.description,
    data.status,
    data.file_url,
    data.created_at,
    data.updated_at,
  ];

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      throw new Error("No rows were affected.");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error when inserting new pipeline:", error);
    throw error;
  }
};

// Update pipeline
export const updatePipeline = async (uuid: string, data: Pipeline) => {
  const query = `
    UPDATE pipeline.pipelines
    SET
      id_category_project = $1,
      project_name = $2,
      id_user_sales = $3,
      id_end_user = $4,
      id_pic_project = $5,
      product_price = $6,
      service_price = $7,
      margin = $8,
      estimated_closed_date = $9,
      estimated_delivered_date = $10,
      description = $11,
      status = $12,
      file_url = $13,
      updated_at = $14
    WHERE uuid = $15
    RETURNING *;`;

  const values = [
    data.id_category_project,
    data.project_name,
    data.id_user_sales,
    data.id_end_user,
    data.id_pic_project,
    data.product_price,
    data.service_price,
    data.margin,
    data.estimated_closed_date,
    data.estimated_delivered_date,
    data.description,
    data.status,
    data.file_url,
    data.updated_at,
    uuid,
  ];

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error when updating pipeline:", error);
    throw error;
  }
};

// Delete pipeline
export const deletePipeline = async (uuid: string) => {
  const query = `DELETE FROM pipeline.pipelines WHERE uuid = $1`;
  try {
    const result = await pool.query(query, [uuid]);
    if (result.rowCount === 0) {
      return null;
    }
  } catch (error) {
    console.error("Error when deleting pipeline:", error);
    throw error;
  }
};
