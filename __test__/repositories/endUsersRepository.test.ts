import pool from "../../src/configs/database";
import {
  getEndUsers,
  getEndUserById,
  createEndUser,
  updateEndUser,
  deleteEndUser,
} from "../../src/repositories/endUsersRepository";
import EndUser from "../../src/models/endUserModel";

// Mock Dependencies
jest.mock("../../src/configs/database");

describe("End User service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get end user", () => {
    it("should get all end users", async () => {
      const mockEndUsers = [
        {
          id: 1,
          name: "name",
          address: "address example",
          pic_name: "pic name",
          phone_number: "1234567890",
          uuid: "998f02be-1111-1111-1111-f9a9abff816e",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: "name 2",
          address: "address example 2",
          pic_name: "pic name 2",
          phone_number: "12345678902",
          uuid: "998f02be-0000-0000-0000-f9a9abff816e",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockEndUsers });

      const result = await getEndUsers();

      expect(result).toEqual(mockEndUsers);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.end_users"
      );
    });

    it("should throw error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(getEndUsers()).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.end_users"
      );
    });
  });

  describe("Get end user by ID", () => {
    const uuid = "998f02be-0000-0000-0000-f9a9abff816e";

    it("should return user by id", async () => {
      const mockEndUsers = [
        {
          id: 2,
          name: "name 2",
          address: "address example 2",
          pic_name: "pic name 2",
          phone_number: "12345678902",
          uuid: "998f02be-0000-0000-0000-f9a9abff816e",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockEndUsers });

      const result = await getEndUserById(uuid);

      expect(result).toEqual(mockEndUsers);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.end_users WHERE uuid = $1 LIMIT 1",
        [uuid]
      );
    });

    it("should return null if end user not found", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await getEndUserById(uuid);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.end_users WHERE uuid = $1 LIMIT 1",
        [uuid]
      );
    });

    it("should throw an error if query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(getEndUserById(uuid)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.end_users WHERE uuid = $1 LIMIT 1",
        [uuid]
      );
    });
  });

  describe("Create user", () => {
    const newEndUser: EndUser = {
      name: "name 2",
      address: "address example 2",
      pic_name: "pic name 2",
      phone_number: "12345678902",
      uuid: "998f02be-0000-0000-0000-f9a9abff816e",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should create new user", async () => {
      const mockResult = { rowCount: 1, rows: [newEndUser] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await createEndUser(newEndUser);

      expect(result).toEqual(newEndUser);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if no rows are affected", async () => {
      const mockResult = { rowCount: 0, rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await expect(createEndUser(newEndUser)).rejects.toThrow(
        "No rows were affected."
      );

      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(createEndUser(newEndUser)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe("Update end user", () => {
    const uuid = "998f02be-0000-0000-0000-f9a9abff816e";
    const updatedEndUser: EndUser = {
      name: "new name",
      address: "new address example",
      pic_name: "new pic name",
      phone_number: "12345678902",
      uuid: "998f02be-0000-0000-0000-f9a9abff816e",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should update the end user", async () => {
      const mockResult = { rowCount: 1, rows: [updatedEndUser] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await updateEndUser(uuid, updatedEndUser);

      expect(result).toEqual(updatedEndUser);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should return null if no rows are found", async () => {
      const mockResult = { rowCount: 0, rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await updateEndUser(uuid, updatedEndUser);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(updateEndUser(uuid, updatedEndUser)).rejects.toThrow(
        "Query failed"
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe("Delete end user", () => {
    const uuid = "998f02be-0000-0000-0000-f9a9abff816e";

    it("should delete the end user", async () => {
      const mockResult = { rowCount: 1 };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await deleteEndUser(uuid);

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.end_users WHERE uuid = $1",
        [uuid]
      );
    });

    it("should return null if no rows are affected", async () => {
      const mockReuslt = { rowCount: 0 };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockReuslt);

      const result = await deleteEndUser(uuid);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.end_users WHERE uuid = $1",
        [uuid]
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(deleteEndUser(uuid)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.end_users WHERE uuid = $1",
        [uuid]
      );
    });
  });
});
