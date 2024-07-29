import pool from "../../src/configs/database";
import {
  getProjectCategory,
  getProjectCategoryById,
  createProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
} from "../../src/repositories/projectCategoryRepository";
import ProjectCategory from "../../src/models/projectCategoryModel";

// Mock dependencies
jest.mock("../../src/configs/database");

describe("projectCategoryRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get project category", () => {
    it("should return all project categories", async () => {
      const mockProjectCategorys = [
        {
          id: 1,
          name: "name",
          uuid: "998f02be-1111-1111-1111-f9a9abff816e",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: "name 2",
          uuid: "998f02be-0000-0000-0000-f9a9abff816e",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: mockProjectCategorys,
      });

      const result = await getProjectCategory();

      expect(result).toEqual(mockProjectCategorys);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.project_categories"
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(getProjectCategory()).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.project_categories"
      );
    });
  });

  describe("Get project category by ID", () => {
    const uuid = "998f02be-0000-0000-0000-f9a9abff816e";

    it("should return project category by ID", async () => {
      const mockProjectCategory = [
        {
          id: 2,
          name: "name 2",
          uuid: "998f02be-0000-0000-0000-f9a9abff816e",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: mockProjectCategory,
      });

      const result = await getProjectCategoryById(uuid);

      expect(result).toEqual(mockProjectCategory);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.project_categories WHERE uuid = $1",
        [uuid]
      );
    });

    it("should return null if project category not found", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await getProjectCategoryById(uuid);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.project_categories WHERE uuid = $1",
        [uuid]
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(getProjectCategoryById(uuid)).rejects.toThrow(
        "Query failed"
      );
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM pipeline.project_categories WHERE uuid = $1",
        [uuid]
      );
    });
  });

  describe("Create project categories", () => {
    const mockProjectCategory: ProjectCategory = {
      name: "name 2",
      uuid: "998f02be-0000-0000-0000-f9a9abff816e",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should create a new project category", async () => {
      const mockResult = { rowCount: 1, rows: [mockProjectCategory] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await createProjectCategory(mockProjectCategory);

      expect(result).toEqual(mockProjectCategory);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if no rows are affected", async () => {
      const mockResult = { rowCount: 0, rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await expect(createProjectCategory(mockProjectCategory)).rejects.toThrow(
        "No rows were affected"
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

      await expect(createProjectCategory(mockProjectCategory)).rejects.toThrow(
        "Query failed"
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe("Update project category", () => {
    const uuid = "998f02be-0000-0000-0000-f9a9abff816e";
    const mockProjectCategory: ProjectCategory = {
      name: "name 2",
      uuid: "998f02be-0000-0000-0000-f9a9abff816e",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should update the project category", async () => {
      const mockResult = { rowCount: 1, rows: [mockProjectCategory] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await updateProjectCategory(uuid, mockProjectCategory);

      expect(result).toEqual(mockProjectCategory);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should return null if no rows are found", async () => {
      const mockResult = { rowCount: 0, rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await updateProjectCategory(uuid, mockProjectCategory);

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

      await expect(
        updateProjectCategory(uuid, mockProjectCategory)
      ).rejects.toThrow("Query failed");

      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe("Delete project category", () => {
    const uuid = "998f02be-0000-0000-0000-f9a9abff816e";

    it("should delete the project category", async () => {
      const mockResult = { rowCount: 1 };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await deleteProjectCategory(uuid);

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.project_categories WHERE uuid = $1",
        [uuid]
      );
    });

    it("should throw an error if no rows are affected", async () => {
      const mockResult = { rowCount: 0 };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await expect(deleteProjectCategory(uuid)).rejects.toThrow(
        "No rows were affected."
      );
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.project_categories WHERE uuid = $1",
        [uuid]
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(deleteProjectCategory(uuid)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.project_categories WHERE uuid = $1",
        [uuid]
      );
    });
  });
});
