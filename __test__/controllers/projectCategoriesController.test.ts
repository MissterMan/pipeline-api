import { Request, Response } from "express";
import { response } from "../../src/utils/response";
import { v4 as uuidv4 } from "uuid";
import {
  createProjectCategory,
  deleteProjectCategory,
  getProjectCategory,
  getProjectCategoryById,
  updateProjectCategory,
} from "../../src/repositories/projectCategoryRepository";
import {
  getProjectCategoriesController,
  getProjectCategoriesByIdController,
  createProjectCategoriesController,
  updateProjectCategoriesController,
  deleteProjectCategoriesController,
} from "../../src/controllers/projectCategoriesController";

// Mock dependencies
jest.mock("../../src/repositories/projectCategoryRepository");
jest.mock("../../src/utils/response");
jest.mock("uuid");

describe("Project Categories Controllers", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockResponseJson: jest.Mock;
  let mockResponseStatus: jest.Mock;

  beforeEach(() => {
    mockResponseJson = jest.fn();
    mockResponseStatus = jest.fn(() => ({
      json: mockResponseJson,
    }));

    mockRequest = {};
    mockResponse = {
      status: mockResponseStatus as unknown as Response["status"],
    };
  });

  describe("getProjectCategoriesController", () => {
    it("should return all project categories", async () => {
      (getProjectCategory as jest.Mock).mockResolvedValueOnce([
        { id: 1, name: "Category 1" },
      ]);

      await getProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(getProjectCategory).toHaveBeenCalledTimes(1);
      expect(response).toHaveBeenCalledWith(
        200,
        [{ id: 1, name: "Category 1" }],
        "Get all categories data",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (getProjectCategory as jest.Mock).mockRejectedValueOnce(
        new Error("Error")
      );

      await getProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        500,
        "Data error",
        "An error occured while retrieving data",
        mockResponse
      );
    });
  });

  describe("getProjectCategoriesByIdController", () => {
    it("should return a project category by ID", async () => {
      (getProjectCategoryById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        name: "Category 1",
      });

      mockRequest.params = { uuid: "test-uuid" };

      await getProjectCategoriesByIdController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(getProjectCategoryById).toHaveBeenCalledWith("test-uuid");
      expect(response).toHaveBeenCalledWith(
        200,
        { id: 1, name: "Category 1" },
        "Get categories by ID",
        mockResponse
      );
    });

    it("should return 404 if category not found", async () => {
      (getProjectCategoryById as jest.Mock).mockResolvedValueOnce(null);

      mockRequest.params = { uuid: "test-uuid" };

      await getProjectCategoriesByIdController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        404,
        null,
        "Categories not found",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (getProjectCategoryById as jest.Mock).mockRejectedValueOnce(
        new Error("Error")
      );

      mockRequest.params = { uuid: "test-uuid" };

      await getProjectCategoriesByIdController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        500,
        "Data error",
        "An error occured while retrieving data",
        mockResponse
      );
    });
  });

  describe("createProjectCategoriesController", () => {
    it("should create a new project category", async () => {
      const newCategory = { id: 1, name: "Category 1" };
      (uuidv4 as jest.Mock).mockReturnValueOnce("test-uuid");
      (createProjectCategory as jest.Mock).mockResolvedValueOnce(newCategory);

      mockRequest.body = { name: "Category 1" };

      await createProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(createProjectCategory).toHaveBeenCalledWith({
        name: "Category 1",
        uuid: "test-uuid",
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(response).toHaveBeenCalledWith(
        201,
        newCategory,
        "Categories created",
        mockResponse
      );
    });

    it("should return 400 if name is missing", async () => {
      mockRequest.body = {};

      await createProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        400,
        "Data error",
        "All data are required",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (createProjectCategory as jest.Mock).mockRejectedValueOnce(
        new Error("Error")
      );

      mockRequest.body = { name: "Category 1" };

      await createProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        500,
        "Data error",
        "An error occured while creating data",
        mockResponse
      );
    });
  });

  describe("updateProjectCategoriesController", () => {
    it("should update a project category", async () => {
      const updatedCategory = { id: 1, name: "Updated Category" };
      (updateProjectCategory as jest.Mock).mockResolvedValueOnce(
        updatedCategory
      );

      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = { name: "Updated Category" };

      await updateProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(updateProjectCategory).toHaveBeenCalledWith("test-uuid", {
        uuid: "test-uuid",
        name: "Updated Category",
        updated_at: expect.any(Date),
      });
      expect(response).toHaveBeenCalledWith(
        200,
        updatedCategory,
        `Categories updated`,
        mockResponse
      );
    });

    it("should return 400 if name is missing", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {};

      await updateProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        400,
        "Data error",
        "All data are required",
        mockResponse
      );
    });

    it("should return 404 if category not found", async () => {
      (updateProjectCategory as jest.Mock).mockResolvedValueOnce(null);

      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = { name: "Updated Category" };

      await updateProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        404,
        "Data not found",
        `Categories not found`,
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (updateProjectCategory as jest.Mock).mockRejectedValueOnce(
        new Error("Error")
      );

      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = { name: "Updated Category" };

      await updateProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        500,
        "Data error",
        "An error occured while creating data",
        mockResponse
      );
    });
  });

  describe("deleteProjectCategoriesController", () => {
    it("should delete a project category", async () => {
      (deleteProjectCategory as jest.Mock).mockResolvedValueOnce(true);

      mockRequest.params = { uuid: "test-uuid" };

      await deleteProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(deleteProjectCategory).toHaveBeenCalledWith("test-uuid");
      expect(response).toHaveBeenCalledWith(
        200,
        "Data deleted",
        "Categories removed",
        mockResponse
      );
    });

    it("should return 404 if category not found", async () => {
      const error = new Error("No rows were affected.");
      (deleteProjectCategory as jest.Mock).mockRejectedValueOnce(error);

      mockRequest.params = { uuid: "test-uuid" };

      await deleteProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        404,
        "Data not found",
        `Categories not found`,
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (deleteProjectCategory as jest.Mock).mockRejectedValueOnce(
        new Error("Error")
      );

      mockRequest.params = { uuid: "test-uuid" };

      await deleteProjectCategoriesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        500,
        "Data error",
        "An error occured while creating data",
        mockResponse
      );
    });
  });
});
