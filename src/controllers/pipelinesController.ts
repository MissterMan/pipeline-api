import { Request, Response } from "express";
import {
  getPipelines,
  getPipelineById,
} from "../repositories/pipelinesRepository";
// Response format
import { response } from "../utils/response";

// Get all pipeline controller
export const getPipelineController = async (req: Request, res: Response) => {
  try {
    // Get query result
    const pipeline = await getPipelines();
    // return response
    return response(200, pipeline, "Get all pipeline", res);
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

// Get pipeline by ID
export const getPipelineByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    // Get uuid from request parameter (URL: localhost/api/pipeline/{uuid})
    const uuid: string = req.params.uuid;
    // Get query result
    const pipeline = await getPipelineById(uuid);
    // Check is pipeline null
    if (pipeline === null) {
      // If true return not found
      return response(404, pipeline, "Pipeline not found", res);
    } else {
      // If false return data
      return response(200, pipeline, "Get pipeline by ID", res);
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
