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
    const passwordValidate = data.password;
    try {
      validatePassword(passwordValidate);
    } catch (error: Error | any) {
      return response(400, "Password error", error.message, res);
    }
    // End of password validation

    // Email Validation
    const emailValidate = data.email;
    try {
      validateEmail(emailValidate);
    } catch (error: Error | any) {
      return response(400, "Email error", error.message, res);
    }
    // End of email validation

    // Create additional data
    const id: number = data.id;
    const name: string = data.name;
    const email: string = emailValidate;
    const role: string = data.role;
    const birthdate: string = new Date(data.birthdate).toJSON().split("T")[0];
    const password: string = await hashPassword(passwordValidate);
    const uuid: string = uuidv4();
    const created_at: Date = new Date();
    const updated_at: Date = created_at;

    // Insert all data into object
    const userData: User = {
      id,
      name,
      email,
      role,
      birthdate,
      password,
      uuid,
      created_at,
      updated_at,
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
    const passwordValidate = data.password.trim();
    try {
      validatePassword(passwordValidate);
    } catch (error: Error | any) {
      return response(400, "Password error", error.message, res);
    }
    // End of password validation

    // Email Validation
    const emailValidate = data.email;
    try {
      validateEmail(emailValidate);
    } catch (error: Error | any) {
      return response(400, "Email error", error.message, res);
    }
    // End of email validation

    // Set updated data
    const id: number = data.id;
    const name: string = data.name;
    const email: string = emailValidate;
    const role: string = data.role;
    const birthdate: string = new Date(data.birthdate).toJSON().split("T")[0];
    const password: string = await hashPassword(passwordValidate);
    const updated_at: Date = new Date();

    // Assign updated data
    const updatedUser: User = {
      id,
      uuid,
      name,
      email,
      role,
      birthdate,
      password,
      updated_at,
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
