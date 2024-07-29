import { authUser } from "../../src/repositories/authRepository";
import pool from "../../src/configs/database";
import bcrypt from "bcrypt";

// Mock Dependencies
jest.mock("../../src/configs/database");
jest.mock("bcrypt");

describe("Auth user", () => {
  // Mock user data
  const mockEmail = "test@example.com";
  const mockPassword = "pass123*";
  const mockUser = {
    id: 1,
    name: "test",
    role: "role test",
    birthdate: "2000-05-29T17:00:00.000Z",
    password: "$2b$10$eXy.3EO5B9QFg4fPZlCjeuqhRkEAmHK5G5cHz.5y6E1fKuyYOP.eW",
    uuid: "1398f3aa-d72e-4cad-8fab-e0d6f6078be9",
    email: mockEmail,
    created_at: "2024-06-19T06:55:03.649Z",
    updated_at: "2024-06-19T06:55:03.649Z",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return user if email and password match", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [mockUser],
    });

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    const result = await authUser(mockEmail, mockPassword);

    expect(result).toEqual(mockUser);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM pipeline.pipeline_users WHERE email = $1",
      [mockEmail]
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockPassword,
      mockUser.password
    );
  });

  it("should return null if email does not exist", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      // Return empty rows
      rows: [],
    });

    const result = await authUser(mockEmail, mockPassword);

    // Expecting null
    expect(result).toBeNull();
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM pipeline.pipeline_users WHERE email = $1",
      [mockEmail]
    );
  });

  it("should return null if password does not match", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [mockUser],
    });

    // Return false when comparing false password
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    const result = await authUser(mockEmail, mockPassword);

    expect(result).toBeNull();
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM pipeline.pipeline_users WHERE email = $1",
      [mockEmail]
    );
  });

  it("should throw an error if there is a database error", async () => {
    (pool.query as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await expect(authUser(mockEmail, mockPassword)).rejects.toThrow(
      "Database error"
    );
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM pipeline.pipeline_users WHERE email = $1",
      [mockEmail]
    );
  });
});
