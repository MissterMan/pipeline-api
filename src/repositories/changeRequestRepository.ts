import pool from "../configs/database";
import ChangeRequest from "../models/changeRequestModel";

export const getChangeRequest = async () => {
  const query = `
    SELECT
      pipeline.change_request.id,
      pipeline.change_request.uuid,
      pipeline.pipelines.project_name,
      pipeline.end_users.name AS end_user,
      user_request.name AS user_request,
      user_approve.name AS user_approve,
      pipeline.pipelines.status AS current_status,
      pipeline.change_request.new_status,
      pipeline.change_request.note,
      pipeline.change_request.request_status,
      pipeline.change_request.created_at,
      pipeline.change_request.updated_at
    FROM
      pipeline.change_request
    LEFT JOIN
      pipeline.pipelines ON pipeline.change_request.id_pipeline = pipelines.id
    LEFT JOIN
      pipeline.end_users ON pipeline.change_request.id_end_user = end_users.id
    LEFT JOIN
      pipeline.pipeline_users AS user_request ON pipeline.change_request.id_user_request = user_request.id
    LEFT JOIN
      pipeline.pipeline_users AS user_approve ON pipeline.change_request.id_user_approval = user_approve.id
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Database query failed:", error); // Log the error message
    throw error;
  }
};

export const createChangeRequest = async (data: ChangeRequest) => {
  const query = `INSERT INTO pipeline.change_request (
      id_pipeline,
      id_user_request,
      new_status,
      note,
      request_status,
      id_user_approval,
      created_at,
      updated_at,
      id_end_user,
      uuid
  )
  VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *;`;

  const values = [
    data.id_pipeline,
    data.id_user_request,
    data.new_status,
    data.note,
    data.request_status,
    data.id_user_approval,
    data.created_at,
    data.updated_at,
    data.id_end_user,
    data.uuid,
  ];
  try {
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw new Error("No rows were affected");
    }
    return result.rows[0];
  } catch (error: any) {
    console.error("Error when inserting new change request:", error);
    throw error;
  }
};

export const approveChangeRequest = async (
  uuid: string,
  admin_id: string | undefined
) => {
  try {
    // Get change request by ID
    const checkResult = await pool.query(
      `SELECT * FROM pipeline.change_request WHERE uuid = $1`,
      [uuid]
    );
    const checkRequest = checkResult.rows[0];

    // Check change request ID
    if (!checkRequest) {
      return null;
    }

    await pool.query(
      `UPDATE pipeline.pipelines SET status = $1 WHERE uuid = $2`,
      [checkRequest.new_status, checkRequest.uuid]
    );

    const result = await pool.query(
      `UPDATE pipeline.change_request SET request_status = $1, id_user_approval = $2, updated_at = $3 WHERE uuid = $4`,
      ["APPROVED", admin_id, new Date(), checkRequest.uuid]
    );
    return result.rowCount;
  } catch (error) {
    console.error("Error when approving change request:", error);
    throw error;
  }
};
