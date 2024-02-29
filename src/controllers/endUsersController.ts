import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { response } from "../utils/response";
import EndUser from "../models/endUserModel";
import {
  createEndUser,
  deleteEndUser,
  getEndUser,
  getEndUserById,
  updateEnduser,
} from "../repositories/endUsersRepository";

export const getEndUserController = async (req: Request, res: Response) => {
  try {
    const endUser = await getEndUser();
    return response(200, endUser, "Get data all end users", res);
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

export const getEndUserByIdController = async (req: Request, res: Response) => {
  try {
    // Get uuid from request parameter (URL: localhost/api/enduser/{uuid})
    const uuid: string = req.params.uuid;
    const endUser = await getEndUserById(uuid);
    if (endUser === null) {
      return response(404, endUser, "End user not found", res);
    }
    return response(200, endUser, "Get end user by ID", res);
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

export const createEndUserController = async (req: Request, res: Response) => {
  try {
    // Get data from requst body
    const data: EndUser = req.body;

    // Check all data required
    if (!data.name || !data.address || !data.pic_name || !data.phone_number) {
      return response(400, "Data error", "All data are required", res);
    }

    // Assign data
    const name: string = data.name;
    const address: string = data.address;
    const pic_name: string = data.pic_name;
    const phone_number: string = data.phone_number;
    const uuid: string = uuidv4();
    const created_at: Date = new Date();
    const updated_at: Date = created_at;

    const endUserData: EndUser = {
      name,
      address,
      pic_name,
      phone_number,
      uuid,
      created_at,
      updated_at,
    };

    const result = await createEndUser(endUserData);
    return response(201, result, "User created", res);
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

export const updateEndUserController = async (req: Request, res: Response) => {
  try {
    const uuid: string = req.params.uuid;
    const data: EndUser = req.body;

    if (!data.name || !data.address || !data.pic_name || !data.phone_number) {
      return response(400, "Data error", "All data are required", res);
    }

    const name: string = data.name;
    const address: string = data.address;
    const pic_name: string = data.pic_name;
    const phone_number: string = data.phone_number;
    const updated_at: Date = new Date();

    const updatedEndUser: EndUser = {
      uuid,
      name,
      address,
      pic_name,
      phone_number,
      updated_at,
    };

    const result = await updateEnduser(uuid, updatedEndUser);
    if (result === null) {
      return response(404, "Data not found", `End User ${uuid} not found`, res);
    }
    return response(200, result, `End User ${uuid} updated`, res);
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

export const deleteEndUserController = async (req: Request, res: Response) => {
  try {
    const uuid: string = req.params.uuid;
    await deleteEndUser(uuid);
    return response(200, "Data Deleted", `End User ${uuid} removed`, res);
  } catch (error: any) {
    console.error(error);
    if (error.message === "No rows were affected.") {
      return response(404, "Data not found", `End User not found`, res);
    }
    return response(
      500,
      "Data error",
      "An error occured while creating data",
      res
    );
  }
};
