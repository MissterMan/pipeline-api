import { Request, Response, NextFunction } from "express";
import { response } from "../utils/response";

export const checkIsAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return response(403, "Error", "Forbidden", res);
  }
  next();
};
