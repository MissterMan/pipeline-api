import { Request, Response } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../repositories/usersRepository";
import { response } from "../utils/response";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import User from "../models/userModel";

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
    const passwordValidate = data.password.trim();
    if (passwordValidate.length < 8) {
      return response(
        400,
        "Password error",
        "Password must be at least 8 characters long",
        res
      );
    }
    if (!/\d/.test(passwordValidate)) {
      return response(
        400,
        "Password error",
        "Password must contain at least one number",
        res
      );
    }
    if (!/[A-Z]/.test(passwordValidate)) {
      return response(
        400,
        "Password error",
        "Password must contain at least one uppercase letter",
        res
      );
    }
    if (!/[a-z]/.test(passwordValidate)) {
      return response(
        400,
        "Password error",
        "Password must contain at least one lowercase letter",
        res
      );
    }
    if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(passwordValidate)) {
      return response(
        400,
        "Password error",
        "Password must contain at least one special character",
        res
      );
    }
    // End of password validation

    // Email Validation
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValidate = data.email.trim();
    if (!emailRegex.test(emailValidate)) {
      return response(400, "Email error", "Email format is invalid", res);
    }
    // End of email validation

    // Create additional data
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
    if (passwordValidate.length < 8) {
      return response(
        400,
        "Password error",
        "Password must be at least 8 characters long",
        res
      );
    }
    if (!/\d/.test(passwordValidate)) {
      return response(
        400,
        "Password error",
        "Password must contain at least one number",
        res
      );
    }
    if (!/[A-Z]/.test(passwordValidate)) {
      return response(
        400,
        "Password error",
        "Password must contain at least one uppercase letter",
        res
      );
    }
    if (!/[a-z]/.test(passwordValidate)) {
      return response(
        400,
        "Password error",
        "Password must contain at least one lowercase letter",
        res
      );
    }
    if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(passwordValidate)) {
      return response(
        400,
        "Password error",
        "Password must contain at least one special character",
        res
      );
    }
    // End of password validation

    // Email Validation
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValidate = data.email.trim();
    if (!emailRegex.test(emailValidate)) {
      return response(400, "Email error", "Email format is invalid", res);
    }
    // End of email validation

    // Set updated data
    const name: string = data.name;
    const email: string = emailValidate;
    const role: string = data.role;
    const birthdate: string = new Date(data.birthdate).toJSON().split("T")[0];
    const password: string = await hashPassword(passwordValidate);
    const updated_at: Date = new Date();

    // Assign updated data
    const updatedUser: User = {
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
    console.error(error);
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

// Hash password
const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve: any, reject) => {
    // Generate salt
    bcrypt.genSalt(10, (err: Error | undefined, salt: string) => {
      if (err) {
        reject(err);
      } else {
        // Hash the password
        bcrypt.hash(password, salt, (err: Error | undefined, hash: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
};
