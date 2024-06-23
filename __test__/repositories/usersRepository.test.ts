import pool from "../../src/configs/database";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../src/repositories/usersRepository";
import User from "../../src/models/userModel";

// Mock dependencies
jest.mock("../../src/configs/database");

describe("User service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get user", () => {
    it("should return all users", async () => {
      const mockUsers = [
        {
          id: 1,
          name: "test",
          role: "role test",
          birthdate: new Date(),
          password:
            "$2b$10$eXy.3EO5B9QFg4fPZlCjeuqhRkEAmHK5G5cHz.5y6E1fKuyYOP.eW",
          uuid: "1398f3aa-d72e-4cad-8fab-e0d6f6078be9",
          email: "test@example.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: "test 2",
          role: "role test 2",
          birthdate: new Date(),
          password:
            "$2b$10$eXy.3EO5B9QFg4fPZlCjeuqhRkEAmHK5G5cHz.5y6E1fKuyYOP.eW",
          uuid: "1398f3aa-d72e-4cad-8fab-e0d6f6078222",
          email: "test2@example.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockUsers });

      const result = await getUsers();

      expect(result).toEqual(mockUsers);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.pipeline_users"
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(getUsers()).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.pipeline_users"
      );
    });
  });

  describe("Get user by ID", () => {
    const uuid = "1398f3aa-d72e-4cad-8fab-e0d6f6078be9";

    it("should return user by id", async () => {
      const mockUser = [
        {
          id: 1,
          name: "test",
          role: "role test",
          birthdate: new Date(),
          password:
            "$2b$10$eXy.3EO5B9QFg4fPZlCjeuqhRkEAmHK5G5cHz.5y6E1fKuyYOP.eW",
          uuid: "1398f3aa-d72e-4cad-8fab-e0d6f6078be9",
          email: "test@example.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockUser });

      const result = await getUserById(uuid);

      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.pipeline_users WHERE uuid = $1",
        [uuid]
      );
    });

    it("should return null if user not found", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await getUserById(uuid);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.pipeline_users WHERE uuid = $1",
        [uuid]
      );
    });

    it("should throw an error if query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(getUserById(uuid)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.pipeline_users WHERE uuid = $1",
        [uuid]
      );
    });
  });

  describe("Create User", () => {
    const newUser: User = {
      id: 1,
      name: "test",
      role: "role test",
      birthdate: "2000-05-29T17:00:00.000Z",
      password: "$2b$10$eXy.3EO5B9QFg4fPZlCjeuqhRkEAmHK5G5cHz.5y6E1fKuyYOP.eW",
      uuid: "1398f3aa-d72e-4cad-8fab-e0d6f6078be9",
      email: "test@example.com",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should create a new user", async () => {
      const mockResult = { rowCount: 1, rows: [newUser] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await createUser(newUser);

      expect(result).toEqual(newUser);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if no rows are affected", async () => {
      const mockResult = { rowCount: 0, rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await expect(createUser(newUser)).rejects.toThrow(
        "No rows were affected"
      );

      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(createUser(newUser)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe("Update user", () => {
    const uuid = "1398f3aa-d72e-4cad-8fab-e0d6f6078be9";
    const updatedUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      birthdate: "2000-05-29T17:00:00.000Z",
      password: "newpassword",
      uuid: uuid,
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should update the user", async () => {
      const mockResult = { rowCount: 1, rows: [updatedUser] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await updateUser(uuid, updatedUser);

      expect(result).toEqual(updatedUser);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should return null if no rows are found", async () => {
      const mockResult = { rowCount: 0, rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await updateUser(uuid, updatedUser);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(updateUser(uuid, updatedUser)).rejects.toThrow(
        "Query failed"
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe("Delete user", () => {
    const uuid = "1398f3aa-0000-0000-0000-e0d6f6078be9";

    it("should delete the user", async () => {
      const mockResult = { rowCount: 1 };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await deleteUser(uuid);

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.pipeline_users WHERE uuid = $1",
        [uuid]
      );
    });

    it("should throw an error if no rows are affected", async () => {
      const mockResult = { rowCount: 0 };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await expect(deleteUser(uuid)).rejects.toThrow("No rows were affected");
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.pipeline_users WHERE uuid = $1",
        [uuid]
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(deleteUser(uuid)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.pipeline_users WHERE uuid = $1",
        [uuid]
      );
    });
  });
});
