import { Request, Response } from "express";
import {
  getPipelines,
  getPipelineById,
  createPipeline,
  updatePipeline,
  deletePipeline,
} from "../repositories/pipelinesRepository";
import { v4 as uuidv4 } from "uuid";
import Pipeline from "../models/pipelineModel";

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

export const createPipelineController = async (req: Request, res: Response) => {
  try {
    const data: Pipeline = req.body;

    if (
      !data.id_category_project ||
      !data.project_name ||
      !data.id_user_sales ||
      !data.id_end_user ||
      !data.id_pic_project ||
      !data.product_price ||
      !data.service_price ||
      !data.margin ||
      !data.estimated_closed_date ||
      !data.estimated_delivered_date ||
      !data.status
    ) {
      return response(400, "Data error", "All data are required", res);
    }

    const pipelineData: Pipeline = {
      ...data,
      uuid: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const pipeline = await createPipeline(pipelineData);
    return response(200, pipeline, "Pipeline created", res);
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

export const updatePipelineController = async (req: Request, res: Response) => {
  try {
    const uuid: string = req.params.uuid;
    const data: Pipeline = req.body;

    if (
      !data.id_category_project ||
      !data.project_name ||
      !data.id_user_sales ||
      !data.id_end_user ||
      !data.id_pic_project ||
      !data.product_price ||
      !data.service_price ||
      !data.margin ||
      !data.estimated_closed_date ||
      !data.estimated_delivered_date ||
      !data.status
    ) {
      return response(400, "Data error", "All data are required", res);
    }

    const updatedPipeline: Pipeline = {
      ...data,
      updated_at: new Date(),
    };

    const result = await updatePipeline(uuid, updatedPipeline);
    if (result === null) {
      return response(404, null, "Pipeline not found", res);
    }
    return response(200, result, "Pipeline updated", res);
  } catch (error) {
    console.error(error);
    return response(
      500,
      "Data error",
      "An error occured while updating data",
      res
    );
  }
};

export const deletePipelineController = async (req: Request, res: Response) => {
  try {
    const uuid: string = req.params.uuid;
    const result = await deletePipeline(uuid);
    if (result === null) {
      return response(404, "Data not found", `Pipeline not found`, res);
    }
    return response(200, "Data deleted", `Pipeline ${uuid} removed`, res);
  } catch (error: any) {
    console.error(error);
    return response(
      500,
      "Data error",
      "An error occured while deleting data",
      res
    );
  }
};
