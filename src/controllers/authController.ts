import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authUser } from "../repositories/authRepository";
import { response } from "../utils/response";
import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: envPath });

let jwtSecretKey: string = process.env.JWT_SECRET as string;
let jwtExpires: string = process.env.JWT_EXPIRE as string;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Password disini harus merupakan password yang sudah dihash agar ketemu
    const user = await authUser(email, password);

    // Validate user
    if (!user) {
      return response(404, user, "Invalid email or password", res);
    }

    // JWT Payload
    const jwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // JWT Signature Sign or Generate Token
    const token = jwt.sign(jwtPayload, jwtSecretKey, {
      expiresIn: jwtExpires,
    });

    const tokenObj = { token: token };

    return response(200, tokenObj, "Authentication success", res);
  } catch (error) {
    return response(500, null, "Failed to authenticate user", res);
  }
};
