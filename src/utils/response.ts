import { Response } from "express";

export const response = (
  status_code: number,
  data: any[] | string | object | null | number,
  message: string,
  res: Response
) => {
  return res.status(status_code).json({
    status_code: status_code,
    message: message,
    payload: data,
  });
};
