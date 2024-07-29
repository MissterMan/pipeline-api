import {
  getChangeRequest,
  createChangeRequest,
  approveChangeRequest,
} from "../../src/repositories/changeRequestRepository";
import pool from "../../src/configs/database";

// Mock dependencies
jest.mock("../../src/configs/database");

describe("Change Request Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getChangeRequest", () => {
    it("should return all change requests", async () => {
      const mockResult = {
        rows: [{ id: 1, uuid: "some-uuid", project_name: "Project 1" }],
      };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await getChangeRequest();

      expect(result).toEqual(mockResult.rows);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(getChangeRequest()).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe("createChangeRequest", () => {
    it("should create a new change request", async () => {
      const mockResult = { rows: [{ id: 1, uuid: "some-uuid" }] };
      const data = {
        id_pipeline: 1,
        id_user_request: "1",
        new_status: "NEW_STATUS",
        note: "Test note",
        request_status: "PENDING",
        id_user_approval: 2,
        created_at: new Date(),
        updated_at: new Date(),
        id_end_user: 1,
        uuid: "some-uuid",
      };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await createChangeRequest(data);

      expect(result).toEqual(mockResult.rows[0]);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
        data.id_pipeline,
        data.id_user_request,
        data.new_status,
        data.note,
        data.request_status,
        data.id_user_approval,
        data.created_at,
        data.updated_at,
        data.id_end_user,
        data.uuid,
      ]);
    });

    it("should throw an error if no rows are affected", async () => {
      const mockResult = { rowCount: 0, rows: [] };
      const data = {
        id_pipeline: 1,
        id_user_request: "1",
        new_status: "NEW_STATUS",
        note: "Test note",
        request_status: "PENDING",
        id_user_approval: 2,
        created_at: new Date(),
        updated_at: new Date(),
        id_end_user: 1,
        uuid: "some-uuid",
      };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await expect(createChangeRequest(data)).rejects.toThrow(
        "No rows were affected"
      );
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
        data.id_pipeline,
        data.id_user_request,
        data.new_status,
        data.note,
        data.request_status,
        data.id_user_approval,
        data.created_at,
        data.updated_at,
        data.id_end_user,
        data.uuid,
      ]);
    });

    it("should throw an error if the query fails", async () => {
      const data = {
        id_pipeline: 1,
        id_user_request: "1",
        new_status: "NEW_STATUS",
        note: "Test note",
        request_status: "PENDING",
        id_user_approval: 2,
        created_at: new Date(),
        updated_at: new Date(),
        id_end_user: 1,
        uuid: "some-uuid",
      };
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(createChangeRequest(data)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
        data.id_pipeline,
        data.id_user_request,
        data.new_status,
        data.note,
        data.request_status,
        data.id_user_approval,
        data.created_at,
        data.updated_at,
        data.id_end_user,
        data.uuid,
      ]);
    });
  });

  describe("approveChangeRequest", () => {
    it("should approve a change request", async () => {
      const mockCheckResult = {
        rows: [{ uuid: "some-uuid", new_status: "APPROVED" }],
      };
      const mockUpdateResult = { rowCount: 1 };
      (pool.query as jest.Mock)
        .mockResolvedValueOnce(mockCheckResult)
        .mockResolvedValueOnce(mockUpdateResult)
        .mockResolvedValueOnce(mockUpdateResult);

      const result = await approveChangeRequest("some-uuid", "admin-id");

      expect(result).toEqual(1);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
        "some-uuid",
      ]);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
        "APPROVED",
        "some-uuid",
      ]);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
        "APPROVED",
        "admin-id",
        expect.any(Date),
        "some-uuid",
      ]);
    });

    it("should return null if no change request is found", async () => {
      const mockCheckResult = { rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockCheckResult);

      const result = await approveChangeRequest("some-uuid", "admin-id");

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
        "some-uuid",
      ]);
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(
        approveChangeRequest("some-uuid", "admin-id")
      ).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
        "some-uuid",
      ]);
    });
  });
});
