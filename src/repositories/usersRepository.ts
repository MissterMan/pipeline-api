import pool from "../configs/database";
import User from "../models/userModel";

export const getUsers = async (): Promise<any[]> => {
  const query = "SELECT * FROM pipeline.pipeline_users";
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error when query all user:", error);
    throw error;
  }
};

export const getUserById = async (uuid: string): Promise<any[] | null> => {
  const query = `SELECT * FROM pipeline.pipeline_users WHERE uuid = $1`;
  try {
    const result = await pool.query(query, [uuid]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows;
  } catch (error) {
    console.error("Error when query user by ID:", error);
    throw error;
  }
};

export const createUser = async (data: User): Promise<any[]> => {
  const query = `INSERT INTO pipeline.pipeline_users 
  (name, email, role, birthdate, password, uuid, created_at, updated_at) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
  RETURNING *;`;

  const values = [
    data.name,
    data.email,
    data.role,
    data.birthdate,
    data.password,
    data.uuid,
    data.created_at,
    data.updated_at,
  ];

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      throw new Error("No rows were affected");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error when inserting new user:", error);
    throw error;
  }
};

export const updateUser = async (uuid: string, data: User) => {
  const query = `
    UPDATE pipeline.pipeline_users 
    SET name = $1, role = $2, email = $3, birthdate = $4, password = $5, updated_at = $6
    WHERE uuid = $7 
    RETURNING *
  `;

  const values = [
    data.name,
    data.role,
    data.email,
    data.birthdate,
    data.password,
    data.updated_at,
    uuid,
  ];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return null;
    } else if (result.rowCount === 0) {
      throw new Error("No rows were affected.");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (uuid: string) => {
  const query = `DELETE FROM pipeline.pipeline_users WHERE uuid = $1`;
  try {
    const result = await pool.query(query, [uuid]);
    if (result.rowCount === 0) {
      throw new Error("No rows were affected.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
