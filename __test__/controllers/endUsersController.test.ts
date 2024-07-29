import { Request, Response } from "express";
import { response } from "../../src/utils/response";
import {
  getEndUserController,
  getEndUserByIdController,
  createEndUserController,
  updateEndUserController,
  deleteEndUserController,
} from "../../src/controllers/endUsersController";
import {
  createEndUser,
  deleteEndUser,
  getEndUsers,
  getEndUserById,
  updateEndUser,
} from "../../src/repositories/endUsersRepository";
import { v4 as uuidv4 } from "uuid";
import EndUser from "../../src/models/endUserModel";

// Mock dependencies
jest.mock("../../src/repositories/endUsersRepository");
jest.mock("../../src/utils/response");
jest.mock("uuid");

describe("EndUser Controllers", () => {
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

  describe("getEndUserController", () => {
    it("should return all end users", async () => {
      (getEndUsers as jest.Mock).mockResolvedValueOnce([
        { id: 1, name: "EndUser 1" },
      ]);

      await getEndUserController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(getEndUsers).toHaveBeenCalledTimes(1);
      expect(response).toHaveBeenCalledWith(
        200,
        [{ id: 1, name: "EndUser 1" }],
        "Get data all end users",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (getEndUsers as jest.Mock).mockRejectedValueOnce(new Error("Error"));

      await getEndUserController(
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

  describe("getEndUserByIdController", () => {
    it("should return an end user by ID", async () => {
      (getEndUserById as jest.Mock).mockResolvedValueOnce({
        id: 1,
        name: "EndUser 1",
      });

      mockRequest.params = { uuid: "test-uuid" };

      await getEndUserByIdController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(getEndUserById).toHaveBeenCalledWith("test-uuid");
      expect(response).toHaveBeenCalledWith(
        200,
        { id: 1, name: "EndUser 1" },
        "Get end user by ID",
        mockResponse
      );
    });

    it("should return 404 if end user not found", async () => {
      (getEndUserById as jest.Mock).mockResolvedValueOnce(null);

      mockRequest.params = { uuid: "test-uuid" };

      await getEndUserByIdController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        404,
        null,
        "End user not found",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (getEndUserById as jest.Mock).mockRejectedValueOnce(new Error("Error"));

      mockRequest.params = { uuid: "test-uuid" };

      await getEndUserByIdController(
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

  describe("createEndUserController", () => {
    it("should create a new end user", async () => {
      const newEndUser = { id: 1, name: "EndUser 1" };
      (uuidv4 as jest.Mock).mockReturnValueOnce("test-uuid");
      (createEndUser as jest.Mock).mockResolvedValueOnce(newEndUser);

      mockRequest.body = {
        name: "EndUser 1",
        address: "Address",
        pic_name: "PIC Name",
        phone_number: "1234567890",
      } as EndUser;

      await createEndUserController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(createEndUser).toHaveBeenCalledWith({
        name: "EndUser 1",
        address: "Address",
        pic_name: "PIC Name",
        phone_number: "1234567890",
        uuid: "test-uuid",
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(response).toHaveBeenCalledWith(
        201,
        newEndUser,
        "End User created",
        mockResponse
      );
    });

    it("should return 400 if required data is missing", async () => {
      mockRequest.body = {};

      await createEndUserController(
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
      (createEndUser as jest.Mock).mockRejectedValueOnce(new Error("Error"));

      mockRequest.body = {
        name: "EndUser 1",
        address: "Address",
        pic_name: "PIC Name",
        phone_number: "1234567890",
      } as EndUser;

      await createEndUserController(
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

  describe("updateEndUserController", () => {
    it("should update an existing end user", async () => {
      const updatedEndUser = { id: 1, name: "Updated EndUser 1" };
      (updateEndUser as jest.Mock).mockResolvedValueOnce(updatedEndUser);

      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {
        name: "Updated EndUser 1",
        address: "New Address",
        pic_name: "New PIC Name",
        phone_number: "0987654321",
      } as EndUser;

      await updateEndUserController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(updateEndUser).toHaveBeenCalledWith("test-uuid", {
        uuid: "test-uuid",
        name: "Updated EndUser 1",
        address: "New Address",
        pic_name: "New PIC Name",
        phone_number: "0987654321",
        updated_at: expect.any(Date),
      });
      expect(response).toHaveBeenCalledWith(
        200,
        updatedEndUser,
        "End User test-uuid updated",
        mockResponse
      );
    });

    it("should return 404 if end user not found", async () => {
      (updateEndUser as jest.Mock).mockResolvedValueOnce(null);

      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {
        name: "Updated EndUser 1",
        address: "New Address",
        pic_name: "New PIC Name",
        phone_number: "0987654321",
      } as EndUser;

      await updateEndUserController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        404,
        "Data not found",
        "End User test-uuid not found",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (updateEndUser as jest.Mock).mockRejectedValueOnce(new Error("Error"));

      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {
        name: "Updated EndUser 1",
        address: "New Address",
        pic_name: "New PIC Name",
        phone_number: "0987654321",
      } as EndUser;

      await updateEndUserController(
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

  describe("deleteEndUserController", () => {
    it("should delete an existing end user", async () => {
      (deleteEndUser as jest.Mock).mockResolvedValueOnce({ id: 1 });

      mockRequest.params = { uuid: "test-uuid" };

      await deleteEndUserController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(deleteEndUser).toHaveBeenCalledWith("test-uuid");
      expect(response).toHaveBeenCalledWith(
        200,
        "Data Deleted",
        "End User test-uuid removed",
        mockResponse
      );
    });

    it("should return 404 if end user not found", async () => {
      (deleteEndUser as jest.Mock).mockResolvedValueOnce(null);

      mockRequest.params = { uuid: "test-uuid" };

      await deleteEndUserController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(response).toHaveBeenCalledWith(
        404,
        "Data not found",
        "End User not found",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (deleteEndUser as jest.Mock).mockRejectedValueOnce(new Error("Error"));

      mockRequest.params = { uuid: "test-uuid" };

      await deleteEndUserController(
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
