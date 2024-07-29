import { Request, Response } from "express";
import { response } from "../../src/utils/response";
import { v4 as uuidv4 } from "uuid";
import {
  createChangeRequest,
  approveChangeRequest,
  getChangeRequest,
} from "../../src/repositories/changeRequestRepository";
import {
  createChangeRequestController,
  approveChangeRequestController,
  getChangeRequestContorller,
} from "../../src/controllers/changeRequestController";
import ChangeRequest from "../../src/models/changeRequestModel";

// Mock dependencies
jest.mock("../../src/repositories/changeRequestRepository");
jest.mock("../../src/utils/response");
jest.mock("uuid");

describe("Change Request Controllers", () => {
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

  describe("getChangeRequestContorller", () => {
    it("should return all change requests", async () => {
      (getChangeRequest as jest.Mock).mockResolvedValueOnce([
        { id: 1, name: "Request 1" },
      ]);

      await getChangeRequestContorller(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(getChangeRequest).toHaveBeenCalledTimes(1);
      expect(response).toHaveBeenCalledWith(
        200,
        [{ id: 1, name: "Request 1" }],
        "Get all changeRequest",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (getChangeRequest as jest.Mock).mockRejectedValueOnce(new Error("Error"));

      await getChangeRequestContorller(
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

  describe("createChangeRequestController", () => {
    it("should create a new change request", async () => {
      const newRequest = { id: 1, name: "Request 1" };
      (uuidv4 as jest.Mock).mockReturnValueOnce("test-uuid");
      (createChangeRequest as jest.Mock).mockResolvedValueOnce(newRequest);

      mockRequest.body = {
        id_pipeline: 1,
        new_status: "NEW_STATUS",
        id_end_user: 1,
      } as ChangeRequest;
      mockRequest.user = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "user",
      };

      await createChangeRequestController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(createChangeRequest).toHaveBeenCalledWith({
        id_pipeline: 1,
        id_user_request: "user-123",
        new_status: "NEW_STATUS",
        note: undefined,
        request_status: "PENDING",
        id_user_approval: undefined,
        id_end_user: 1,
        uuid: "test-uuid",
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(response).toHaveBeenCalledWith(
        200,
        newRequest,
        "Change Request created",
        mockResponse
      );
    });

    it("should return 400 if required data is missing", async () => {
      mockRequest.body = {};
      mockRequest.user = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "user",
      };

      await createChangeRequestController(
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
      (createChangeRequest as jest.Mock).mockRejectedValueOnce(
        new Error("Error")
      );

      mockRequest.body = {
        id_pipeline: 1,
        new_status: "NEW_STATUS",
        id_end_user: 1,
      } as ChangeRequest;
      mockRequest.user = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "user",
      };

      await createChangeRequestController(
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

  describe("approveChangeRequestController", () => {
    it("should approve a change request", async () => {
      const updatedRequest = { id: 1, name: "Request 1", status: "APPROVED" };
      (approveChangeRequest as jest.Mock).mockResolvedValueOnce(updatedRequest);

      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.user = {
        id: "admin-123",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
      };

      await approveChangeRequestController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(approveChangeRequest).toHaveBeenCalledWith(
        "test-uuid",
        "admin-123"
      );
      expect(response).toHaveBeenCalledWith(
        200,
        updatedRequest,
        "Change Request updated",
        mockResponse
      );
    });

    it("should return 404 if change request not found", async () => {
      (approveChangeRequest as jest.Mock).mockResolvedValueOnce(null);

      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.user = {
        id: "admin-123",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
      };

      await approveChangeRequestController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        404,
        null,
        "Change Request not found",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (approveChangeRequest as jest.Mock).mockRejectedValueOnce(
        new Error("Error")
      );

      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.user = {
        id: "admin-123",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
      };

      await approveChangeRequestController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        500,
        "Error",
        "An error occured while updating data",
        mockResponse
      );
    });
  });
});
