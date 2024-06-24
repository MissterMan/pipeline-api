import { Request, Response } from "express";
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
} from "../../src/controllers/usersController";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../src/repositories/usersRepository";
import { response } from "../../src/utils/response";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../../src/utils/hashPassword";
import {
  validateEmail,
  validatePassword,
} from "../../src/utils/credentialValidation";

// Mock dependencies
jest.mock("../../src/repositories/usersRepository");
jest.mock("../../src/utils/response");
jest.mock("../../src/utils/hashPassword");
jest.mock("../../src/utils/credentialValidation");
jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("test-uuid"), // Mock uuidv4 to always return "test-uuid"
}));
jest.mock("bcrypt");

describe("User Controller", () => {
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
  }, 30000);

  afterEach(() => {
    jest.clearAllMocks();
  }, 30000);

  describe("Get user controller", () => {
    it("should return all users", async () => {
      (getUsers as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);
      await getUsersController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(getUsers).toHaveBeenCalledTimes(1);
      expect(response).toHaveBeenCalledWith(
        200,
        [{ id: 1 }],
        "Get data all users",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (getUsers as jest.Mock).mockRejectedValueOnce(new Error("Error"));
      await getUsersController(
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

  describe("Get user by ID controller", () => {
    it("should return a user by ID", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (getUserById as jest.Mock).mockResolvedValueOnce({ id: 1 });
      await getUserByIdController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(getUserById).toHaveBeenCalledWith("test-uuid");
      expect(response).toHaveBeenCalledWith(
        200,
        { id: 1 },
        "Get user by ID",
        mockResponse
      );
    });

    it("should return 404 if user not found", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (getUserById as jest.Mock).mockResolvedValueOnce(null);
      await getUserByIdController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(response).toHaveBeenCalledWith(
        404,
        null,
        "User not found",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (getUserById as jest.Mock).mockRejectedValueOnce(new Error("Error"));
      await getUserByIdController(
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

  describe("Create User Controller", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
    });

    it("should create a new user", async () => {
      const newUser = { id: 1 };
      (uuidv4 as jest.Mock).mockReturnValueOnce("test-uuid");
      (hashPassword as jest.Mock).mockResolvedValueOnce("hashedPassword");
      (createUser as jest.Mock).mockResolvedValueOnce(newUser);
      mockRequest.body = {
        id: 1,
        name: "test",
        email: "test@example.com",
        role: "admin",
        birthdate: new Date(),
        password: "Password123!",
      };

      await createUserController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(createUser).toHaveBeenCalledWith({
        id: 1,
        name: "test",
        email: "test@example.com",
        role: "admin",
        birthdate: expect.any(Date),
        password: "hashedPassword",
        uuid: "test-uuid",
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(response).toHaveBeenCalledWith(
        201,
        newUser,
        "User created",
        mockResponse
      );
    });

    it("should return 400 if required fields are missing", async () => {
      mockRequest.body = {};

      await createUserController(
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

    it("should return 400 if password validation fails", async () => {
      (validatePassword as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Password must contain at least one number");
      });
      mockRequest.body = {
        name: "test",
        email: "test@example.com",
        role: "admin",
        birthdate: new Date(),
        password: "password!",
      };

      await createUserController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(response).toHaveBeenCalledWith(
        400,
        "Password error",
        "Password must contain at least one number",
        mockResponse
      );
    });

    it("should return 400 if email validation fails", async () => {
      (validateEmail as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Email format is invalid");
      });
      mockRequest.body = {
        name: "test",
        email: "invalid-email",
        role: "admin",
        birthdate: new Date(),
        password: "Password123!",
      };

      await createUserController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(response).toHaveBeenCalledWith(
        400,
        "Email error",
        "Email format is invalid",
        mockResponse
      );
    });

    it("should handle errors", async () => {
      (createUser as jest.Mock).mockRejectedValueOnce(new Error("Error"));
      mockRequest.body = {
        name: "test",
        email: "test@example.com",
        role: "admin",
        birthdate: new Date(),
        password: "Password123!",
      };
      await createUserController(
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

  describe("Update User Controller", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
    });

    it("should update an existing user", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {
        id: 1,
        name: "test",
        email: "test@example.com",
        role: "admin",
        birthdate: new Date(),
        password: "Password123!",
      };
      const updatedUser = { id: 1 };
      (hashPassword as jest.Mock).mockResolvedValueOnce("hashedPassword");
      (updateUser as jest.Mock).mockResolvedValueOnce(updatedUser);

      await updateUserController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(updateUser).toHaveBeenCalledWith("test-uuid", {
        id: 1,
        name: "test",
        email: "test@example.com",
        role: "admin",
        birthdate: expect.any(Date), // Adjusted expectation for birthdate
        password: "hashedPassword",
        updated_at: expect.any(Date), // Adjusted expectation for updated_at
      });
      expect(response).toHaveBeenCalledWith(
        200,
        updatedUser,
        "User test-uuid updated",
        mockResponse
      );
    });

    it("should return 400 if required fields are missing", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {};

      await updateUserController(
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

    it("should return 404 if user not found", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {
        id: 1,
        name: "test",
        email: "test@example.com",
        role: "admin",
        birthdate: new Date(),
        password: "Password123!",
      };
      (updateUser as jest.Mock).mockResolvedValueOnce(null);

      await updateUserController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(response).toHaveBeenCalledWith(
        404,
        "Data not found",
        `User test-uuid not found`,
        mockResponse
      );
    });

    it("should handle errors", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      mockRequest.body = {
        id: 1,
        name: "test",
        email: "test@example.com",
        role: "admin",
        birthdate: new Date(),
        password: "Password123!",
      };
      (updateUser as jest.Mock).mockRejectedValueOnce(new Error("Error"));

      await updateUserController(
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

  describe("Delete user controller", () => {
    it("should delete a user", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (deleteUser as jest.Mock).mockResolvedValueOnce(true);

      await deleteUserController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(deleteUser).toHaveBeenCalledWith("test-uuid");
      expect(response).toHaveBeenCalledWith(
        200,
        "Data deleted",
        `User test-uuid removed`,
        mockResponse
      );
    });

    it("should throw error if user not found", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (deleteUser as jest.Mock).mockRejectedValueOnce(
        new Error("No rows were affected.")
      );

      await deleteUserController(
        mockRequest as Request,
        mockResponse as Response
      );
      expect(response).toHaveBeenCalledWith(
        404,
        "Data not found",
        `User not found`,
        mockResponse
      );
    });

    it("should handle errors", async () => {
      mockRequest.params = { uuid: "test-uuid" };
      (deleteUser as jest.Mock).mockRejectedValueOnce(new Error("Error"));

      await deleteUserController(
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
