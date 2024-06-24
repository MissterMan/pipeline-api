import { Request, Response } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../repositories/usersRepository";
import { response } from "../utils/response";
import { validatePassword, validateEmail } from "../utils/credentialValidation";
import { v4 as uuidv4 } from "uuid";
import User from "../models/userModel";
import { hashPassword } from "../utils/hashPassword";

const handleValidation = (
  validateFn: (value: any) => boolean,
  value: any,
  errorMessage: string,
  res: Response
): boolean => {
  try {
    validateFn(value);
    return true;
  } catch (error: any) {
    response(400, errorMessage, error.message, res);
    return false;
  }
};

// Get all users data
export const getUsersController = async (req: Request, res: Response) => {
  try {
    // Get query result
    const users = await getUsers();
    return response(200, users, "Get data all users", res);
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

// Get user by ID
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    // Get uuid from request parameter (URL: localhost/api/user/{uuid})
    const uuid: string = req.params.uuid;
    // Get query result
    const user = await getUserById(uuid);
    // Check is user null
    if (user === null) {
      // If true return not found
      return response(404, user, "User not found", res);
    } else {
      // If false return data
      return response(200, user, "Get user by ID", res);
    }
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

export const createUserController = async (req: Request, res: Response) => {
  try {
    // Get data from request body
    const data: User = req.body;

    // Check all data required
    if (
      !data.name ||
      !data.email ||
      !data.role ||
      !data.birthdate ||
      !data.password
    ) {
      return response(400, "Data error", "All data are required", res);
    }

    // Password Validation
    if (
      !handleValidation(validatePassword, data.password, "Password error", res)
    ) {
      return;
    }
    // End of password validation

    // Email Validation
    if (!handleValidation(validateEmail, data.email, "Email error", res)) {
      return;
    }
    // End of email validation

    // Insert all data into object
    const userData: User = {
      ...data,
      password: await hashPassword(data.password),
      uuid: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await createUser(userData);
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

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const uuid: string = req.params.uuid;
    const data: User = req.body;

    if (!data.name || !data.role || !data.birthdate || !data.password) {
      return response(400, "Data error", "All data are required", res);
    }

    // Password Validation
    if (
      !handleValidation(validatePassword, data.password, "Password error", res)
    ) {
      return;
    }
    // End of password validation

    // Email Validation
    if (!handleValidation(validateEmail, data.email, "Email error", res)) {
      return;
    }
    // End of email validation

    // Set updated data

    // Assign updated data
    const updatedUser: User = {
      ...data,
      password: await hashPassword(data.password),
      updated_at: new Date(),
    };

    const result = await updateUser(uuid, updatedUser);
    if (result === null) {
      return response(404, "Data not found", `User ${uuid} not found`, res);
    }
    return response(200, result, `User ${uuid} updated`, res);
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

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const uuid: string = req.params.uuid;
    await deleteUser(uuid);
    return response(200, "Data deleted", `User ${uuid} removed`, res);
  } catch (error: any) {
    if (error.message === "No rows were affected.") {
      return response(404, "Data not found", `User not found`, res);
    }
    return response(
      500,
      "Data error",
      "An error occured while creating data",
      res
    );
  }
};
