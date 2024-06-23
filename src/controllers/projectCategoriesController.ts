import { Request, Response } from "express";
import { response } from "../utils/response";
import { v4 as uuidv4 } from "uuid";
import ProjectCategory from "../models/projectCategoryModel";
import {
  createProjectCategory,
  deleteProjectCategory,
  getProjectCategory,
  getProjectCategoryById,
  updateProjectCategory,
} from "../repositories/projectCategoryRepository";

export const getProjectCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await getProjectCategory();
    return response(200, categories, "Get all categories data", res);
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

export const getProjectCategoriesByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const uuid: string = req.params.uuid;
    const categories = await getProjectCategoryById(uuid);
    if (categories === null) {
      return response(404, categories, "Categories not found", res);
    } else {
      return response(200, categories, "Get categories by ID", res);
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

export const createProjectCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const data: ProjectCategory = req.body;
    if (!data.name) {
      return response(400, "Data error", "All data are required", res);
    }

    const name: string = data.name;
    const uuid: string = uuidv4();
    const created_at: Date = new Date();
    const updated_at: Date = created_at;

    const categoriesData: ProjectCategory = {
      name,
      uuid,
      created_at,
      updated_at,
    };

    const result = await createProjectCategory(categoriesData);
    return response(201, result, "Categories created", res);
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

export const updateProjectCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const uuid: string = req.params.uuid;
    const data: ProjectCategory = req.body;

    if (!data.name) {
      return response(400, "Data error", "All data are required", res);
    }

    // Set updated data
    const name: string = data.name;
    const updated_at: Date = new Date();

    // Assign updated data
    const updatedCategories: ProjectCategory = {
      uuid,
      name,
      updated_at,
    };

    const result = await updateProjectCategory(uuid, updatedCategories);
    if (result === null) {
      return response(404, "Data not found", `Categories not found`, res);
    }
    return response(200, result, `Categories updated`, res);
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

export const deleteProjectCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const uuid: string = req.params.uuid;
    await deleteProjectCategory(uuid);
    return response(200, "Data deleted", "Categories removed", res);
  } catch (error: any) {
    console.error(error);
    if (error.message === "No rows were affected.") {
      return response(404, "Data not found", `Categories not found`, res);
    }
    return response(
      500,
      "Data error",
      "An error occured while creating data",
      res
    );
  }
};
