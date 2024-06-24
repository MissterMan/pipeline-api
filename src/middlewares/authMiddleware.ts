import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { response } from "../utils/response";
import path from "path";

const env = process.env.NODE_ENV ?? "development";
const envPath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: envPath });

let jwtSecretKey: string = process.env.JWT_SECRET as string;
interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return response(
      403,
      "Invalid token",
      "Access denied, no token provided",
      res
    );
  }

  const token = authHeader.split(" ")[1]; // Ekstrak token dari "Bearer <token>"

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return response(401, "Error", "Unauthorized", res);
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
