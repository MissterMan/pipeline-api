import pool from "../configs/database";
import EndUser from "../models/endUserModel";

export const getEndUser = async (): Promise<any[]> => {
  const query = "SELECT * FROM pipeline.end_users";
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error when query all end users:", error);
    throw error;
  }
};

export const getEndUserById = async (uuid: string): Promise<any[] | null> => {
  const query = "SELECT * FROM pipeline.end_users WHERE uuid = $1 LIMIT 1";
  try {
    const result = await pool.query(query, [uuid]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows;
  } catch (error) {
    console.error("Error when query end user by ID:", error);
    throw error;
  }
};

export const createEndUser = async (data: EndUser): Promise<any[]> => {
  const query = `
  INSERT INTO pipeline.end_users
  (name, address, pic_name, phone_number, uuid, created_at, updated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *;`;

  const values = [
    data.name,
    data.address,
    data.pic_name,
    data.phone_number,
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
    console.error("Error when inserting new end user:", error);
    throw error;
  }
};

export const updateEnduser = async (uuid: string, data: EndUser) => {
  const query = `
  UPDATE pipeline.end_users
  SET name = $1, address = $2, pic_name = $3, phone_number = $4, updated_at = $5
  WHERE uuid = $6
  RETURNING * 
  `;

  const values = [
    data.name,
    data.address,
    data.pic_name,
    data.phone_number,
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
    console.error("Error updating end user:", error);
    throw error;
  }
};

export const deleteEndUser = async (uuid: string) => {
  const query = `DELETE FROM pipeline.end_users WHERE uuid = $1`;
  try {
    const result = await pool.query(query, [uuid]);
    if (result.rowCount === 0) {
      throw new Error("No rows were affected.");
    }
  } catch (error) {
    console.error("Error deleting end user:", error);
    throw error;
  }
};
