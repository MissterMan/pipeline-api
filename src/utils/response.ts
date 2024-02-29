import { Response } from "express";

export const response = (
  status_code: number,
  data: any[] | string | null,
  message: string,
  res: Response
) => {
  res.status(status_code).json({
    status_code: status_code,
    message: message,
    payload: data,
  });
};
