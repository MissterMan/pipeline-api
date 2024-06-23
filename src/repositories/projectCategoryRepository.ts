import pool from "../configs/database";
import ProjectCategory from "../models/projectCategoryModel";

export const getProjectCategory = async (): Promise<any[]> => {
  const query = "SELECT * FROM pipeline.project_categories";
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.log("Error when query all user:", error);
    throw error;
  }
};

export const getProjectCategoryById = async (
  uuid: string
): Promise<any[] | null> => {
  const query = `SELECT * FROM pipeline.project_categories WHERE uuid = $1`;
  try {
    const result = await pool.query(query, [uuid]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows;
  } catch (error) {
    console.error("Error when query categories by ID:", error);
    throw error;
  }
};

export const createProjectCategory = async (
  data: ProjectCategory
): Promise<any[]> => {
  const query = `INSERT INTO pipeline.project_categories 
  (name, uuid, created_at, updated_at) 
  VALUES ($1, $2, $3, $4) 
  RETURNING *;`;

  const values = [data.name, data.uuid, data.created_at, data.updated_at];

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      throw new Error("No rows were affected");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error when inserting new categories:", error);
    throw error;
  }
};

export const updateProjectCategory = async (
  uuid: string,
  data: ProjectCategory
): Promise<any[] | null> => {
  const query = `
  UPDATE pipeline.project_categories
  SET name = $1, updated_at = $2
  WHERE uuid = $3
  RETURNING *;
  `;

  const values = [data.name, data.updated_at, uuid];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return null;
    } else if (result.rowCount === 0) {
      throw new Error("No rows were affected.");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating project categories:", error);
    throw error;
  }
};

export const deleteProjectCategory = async (uuid: string) => {
  const query = `DELETE FROM pipeline.project_categories WHERE uuid = $1`;
  try {
    const result = await pool.query(query, [uuid]);
    if (result.rowCount === 0) {
      throw new Error("No rows were affected.");
    }
  } catch (error) {
    console.error("Error deleting project categories:", error);
    throw error;
  }
};
