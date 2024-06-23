import { Request, Response } from "express";
import {
  approveChangeRequest,
  createChangeRequest,
  getChangeRequest,
} from "../repositories/changeRequestRepository";
import ChangeRequest from "../models/changeRequestModel";
import { v4 as uuidv4 } from "uuid";

// Response format
import { response } from "../utils/response";

export const getChangeRequestContorller = async (
  req: Request,
  res: Response
) => {
  try {
    // Get query result
    const changeRequest = await getChangeRequest();

    // return response
    return response(200, changeRequest, "Get all changeRequest", res);
  } catch (error) {
    console.error(error);
    return response(
      500,
      "Data error",
      "An error occured while retrieving data",
      res
    );
  }
};

export const createChangeRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    // Get data from request body
    const data: ChangeRequest = req.body;
    const userId = req.user?.id;

    if (!data.id_pipeline || !data.new_status || !data.id_end_user) {
      return response(400, "Data error", "All data are required", res);
    }

    const id_pipeline: number = data.id_pipeline;
    const id_user_request: string | undefined = userId;
    const new_status: string = data.new_status;
    const note: string | undefined = data.note;
    const request_status: string | undefined = "PENDING";
    const id_user_approval: number | undefined = data.id_user_approval;
    const id_end_user: number = data.id_end_user;
    const uuid: string = uuidv4();
    const created_at: Date = new Date();
    const updated_at: Date = created_at;

    const changeRequestData: ChangeRequest = {
      id_pipeline,
      id_user_request,
      new_status,
      note,
      request_status,
      id_user_approval,
      id_end_user,
      uuid,
      created_at,
      updated_at,
    };

    console.log(changeRequestData);

    const changeRequest = await createChangeRequest(changeRequestData);
    return response(200, changeRequest, "Change Request created", res);
  } catch (error) {
    console.error(error);
    return response(
      500,
      "Data error",
      "An error occured while creating data",
      res
    );
  }
};

export const approveChangeRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    // Change Request UUID
    const uuid: string = req.params.uuid;
    const userId: string | undefined = req.user?.id;

    const result = await approveChangeRequest(uuid, userId);
    if (result === null) {
      return response(404, null, "Change Request not found", res);
    }
    return response(200, result, "Change Request updated", res);
  } catch (error) {
    console.error(error);
    return response(500, "Error", "An error occured while updating data", res);
  }
};
