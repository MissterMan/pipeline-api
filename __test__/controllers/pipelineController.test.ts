import { Request, Response } from "express";
import {
  getPipelineController,
  getPipelineByIdController,
  createPipelineController,
  updatePipelineController,
  deletePipelineController,
} from "../../src/controllers/pipelinesController";
import {
  getPipelines,
  getPipelineById,
  createPipeline,
  updatePipeline,
  deletePipeline,
} from "../../src/repositories/pipelinesRepository";
import { response } from "../../src/utils/response";
import { v4 as uuidv4 } from "uuid";

// Mock dependencies
jest.mock("../../src/repositories/pipelinesRepository");
jest.mock("../../src/utils/response");
jest.mock("uuid");

describe("Pipeline Controller", () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPipelineController", () => {
    it("should return all pipelines", async () => {
      (getPipelines as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);
      await getPipelineController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(getPipelines).toHaveBeenCalledTimes(1);
      expect(response).toHaveBeenCalledWith(
        200,
        [{ id: 1 }],
        "Get all pipeline",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (getPipelines as jest.Mock).mockRejectedValueOnce(new Error("Error"));
      await getPipelineController(
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

  describe("getPipelineByIdController", () => {
    it("should return a pipeline by ID", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (getPipelineById as jest.Mock).mockResolvedValueOnce({ id: 1 });
      await getPipelineByIdController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(getPipelineById).toHaveBeenCalledWith("test-uuid");
      expect(response).toHaveBeenCalledWith(
        200,
        { id: 1 },
        "Get pipeline by ID",
        mockResponse
      );
    });

    it("should return 404 if pipeline not found", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (getPipelineById as jest.Mock).mockResolvedValueOnce(null);
      await getPipelineByIdController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(response).toHaveBeenCalledWith(
        404,
        null,
        "Pipeline not found",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (getPipelineById as jest.Mock).mockRejectedValueOnce(new Error("Error"));
      await getPipelineByIdController(
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

  describe("createPipelineController", () => {
    it("should create a new pipeline", async () => {
      const newPipeline = { id: 1 };
      (uuidv4 as jest.Mock).mockReturnValueOnce("test-uuid");
      (createPipeline as jest.Mock).mockResolvedValueOnce(newPipeline);
      mockRequest.body = {
        id_category_project: 1,
        project_name: "test",
        id_user_sales: 1,
        id_end_user: 1,
        id_pic_project: 1,
        product_price: 100,
        service_price: 100,
        margin: 50,
        estimated_closed_date: new Date(),
        estimated_delivered_date: new Date(),
        status: "ongoing",
      };

      await createPipelineController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(createPipeline).toHaveBeenCalledTimes(1);
      expect(response).toHaveBeenCalledWith(
        200,
        newPipeline,
        "Pipeline created",
        mockResponse
      );
    });

    it("should return 400 if required data is missing", async () => {
      mockRequest.body = {};
      await createPipelineController(
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
      (createPipeline as jest.Mock).mockRejectedValueOnce(new Error("Error"));
      mockRequest.body = {
        id_category_project: 1,
        project_name: "test",
        id_user_sales: 1,
        id_end_user: 1,
        id_pic_project: 1,
        product_price: 100,
        service_price: 100,
        margin: 50,
        estimated_closed_date: new Date(),
        estimated_delivered_date: new Date(),
        status: "ongoing",
      };

      await createPipelineController(
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

  describe("updatePipelineController", () => {
    it("should update an existing pipeline", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {
        id_category_project: 1,
        project_name: "test",
        id_user_sales: 1,
        id_end_user: 1,
        id_pic_project: 1,
        product_price: 100,
        service_price: 100,
        margin: 50,
        estimated_closed_date: new Date(),
        estimated_delivered_date: new Date(),
        status: "ongoing",
      };
      const updatedPipeline = { id: 1 };
      (updatePipeline as jest.Mock).mockResolvedValueOnce(updatedPipeline);

      await updatePipelineController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(updatePipeline).toHaveBeenCalledWith("test-uuid", {
        ...mockRequest.body,
        updated_at: expect.any(Date),
      });
      expect(response).toHaveBeenCalledWith(
        200,
        updatedPipeline,
        "Pipeline updated",
        mockResponse
      );
    });

    it("should return 400 if required data is missing", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {};
      await updatePipelineController(
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

    it("should return 404 if pipeline not found", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {
        id_category_project: 1,
        project_name: "test",
        id_user_sales: 1,
        id_end_user: 1,
        id_pic_project: 1,
        product_price: 100,
        service_price: 100,
        margin: 50,
        estimated_closed_date: new Date(),
        estimated_delivered_date: new Date(),
        status: "ongoing",
      };
      (updatePipeline as jest.Mock).mockResolvedValueOnce(null);

      await updatePipelineController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(response).toHaveBeenCalledWith(
        404,
        null,
        "Pipeline not found",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {
        id_category_project: 1,
        project_name: "test",
        id_user_sales: 1,
        id_end_user: 1,
        id_pic_project: 1,
        product_price: 100,
        service_price: 100,
        margin: 50,
        estimated_closed_date: new Date(),
        estimated_delivered_date: new Date(),
        status: "ongoing",
      };
      (updatePipeline as jest.Mock).mockRejectedValueOnce(new Error("Error"));

      await updatePipelineController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(response).toHaveBeenCalledWith(
        500,
        "Data error",
        "An error occured while updating data",
        mockResponse
      );
    });
  });

  describe("deletePipelineController", () => {
    it("should delete a pipeline", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (deletePipeline as jest.Mock).mockResolvedValueOnce(true);

      await deletePipelineController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(deletePipeline).toHaveBeenCalledWith("test-uuid");
      expect(response).toHaveBeenCalledWith(
        200,
        "Data deleted",
        "Pipeline test-uuid removed",
        mockResponse
      );
    });

    it("should return 404 if pipeline not found", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (deletePipeline as jest.Mock).mockResolvedValueOnce(null);

      await deletePipelineController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(response).toHaveBeenCalledWith(
        404,
        "Data not found",
        "Pipeline not found",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (deletePipeline as jest.Mock).mockRejectedValueOnce(new Error("Error"));

      await deletePipelineController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(response).toHaveBeenCalledWith(
        500,
        "Data error",
        "An error occured while deleting data",
        mockResponse
      );
    });
  });
});
