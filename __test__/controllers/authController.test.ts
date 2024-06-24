import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { authUser } from "../../src/repositories/authRepository";
import { response } from "../../src/utils/response";
import { login } from "../../src/controllers/authController";

const env = process.env.NODE_ENV ?? "development";
const envPath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: envPath });

jest.mock("jsonwebtoken");
jest.mock("../../src/repositories/authRepository");
jest.mock("../../src/utils/response");

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  // Before testing set or simulate request body
  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Login", () => {
    it("should return 200 and token if authentication successful", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test admin",
        role: "admin",
      };

      const mockToken = "mock_jwt_token";
      (authUser as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      await login(req as Request, res as Response);

      expect(authUser).toHaveBeenCalledWith("test@example.com", "password123");
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );
      expect(response).toHaveBeenCalledWith(
        200,
        { token: mockToken },
        "Authentication success",
        res
      );
    });

    it("should return 404 if user not found or failed", async () => {
      (authUser as jest.Mock).mockResolvedValueOnce(null);

      await login(req as Request, res as Response);

      expect(authUser).toHaveBeenCalledWith("test@example.com", "password123");
      expect(response).toHaveBeenCalledWith(
        404,
        null,
        "Invalid email or password",
        res
      );
    });

    it("should return 500 if there is an error during authentication", async () => {
      (authUser as jest.Mock).mockRejectedValueOnce(
        new Error("Authentication error")
      );

      await login(req as Request, res as Response);

      expect(authUser).toHaveBeenCalledWith("test@example.com", "password123");
      expect(response).toHaveBeenCalledWith(
        500,
        null,
        "Failed to authenticate user",
        res
      );
    });
  });
});
