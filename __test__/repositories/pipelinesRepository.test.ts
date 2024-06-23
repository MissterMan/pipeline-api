import pool from "../../src/configs/database";
import {
  getPipelines,
  getPipelineById,
  createPipeline,
  updatePipeline,
  deletePipeline,
} from "../../src/repositories/pipelinesRepository";
import Pipeline from "../../src/models/pipelineModel";

// Mock dependencies
jest.mock("../../src/configs/database");

// Grouping tests (Pipeline service/repository)
describe("Pipelines service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get pipeline", () => {
    it("should return ", async () => {
      const mockPipelines = [
        {
          id: 115,
          uuid: "7aaff58c-0000-0000-0000-3adfe69a3c1a",
          project_name: "Pengadaan Data Center",
          sales_name: "Budi",
          pic_name: "Andi",
          end_user_name: "PT. SPIL",
          product_price: "55000000",
          service_price: "150000",
          margin: "200000",
          status: "LOST",
          categories: "IT Infrastructure",
          description: "TESTING",
          file_url: "TESTING",
          estimated_closed_date: "2024-04-19T17:00:00.000Z",
          estimated_delivered_date: "2024-04-29T17:00:00.000Z",
        },
        {
          id: 111,
          uuid: "7aaff58c-1111-1111-1111-3adfe69a3c1a",
          project_name: "Pengadaan Data Center",
          sales_name: "Budi",
          pic_name: "Andi",
          end_user_name: "PT. SPIL",
          product_price: "55000000",
          service_price: "150000",
          margin: "200000",
          status: "LOST",
          categories: "IT Infrastructure",
          description: "TESTING",
          file_url: "TESTING",
          estimated_closed_date: "2024-04-19T17:00:00.000Z",
          estimated_delivered_date: "2024-04-29T17:00:00.000Z",
        },
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: mockPipelines,
      });

      const result = await getPipelines();

      expect(result).toEqual(mockPipelines);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });

    it("should throw an error if query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(getPipelines()).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe("Get pipeline by ID", () => {
    const uuid = "7aaff58c-0000-0000-0000-3adfe69a3c1a";

    it("should return pipeline by ID", async () => {
      const mockPipeline = [
        {
          id: 115,
          uuid: "7aaff58c-0000-0000-0000-3adfe69a3c1a",
          project_name: "Pengadaan Data Center",
          sales_name: "Budi",
          pic_name: "Andi",
          end_user_name: "PT. SPIL",
          product_price: "55000000",
          service_price: "150000",
          margin: "200000",
          status: "LOST",
          categories: "IT Infrastructure",
          description: "TESTING",
          file_url: "TESTING",
          estimated_closed_date: "2024-04-19T17:00:00.000Z",
          estimated_delivered_date: "2024-04-29T17:00:00.000Z",
        },
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: mockPipeline,
      });

      const result = await getPipelineById(uuid);

      expect(result).toEqual(mockPipeline);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should return null if pipeline not found", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [],
      });

      const result = await getPipelineById(uuid);

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

      await expect(getPipelineById(uuid)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe("Create pipeline", () => {
    const newPipeline: Pipeline = {
      id_category_project: 1,
      uuid: "7aaff58c-0000-0000-0000-3adfe69a3c1a",
      project_name: "Test",
      id_user_sales: 1,
      id_end_user: 1,
      id_pic_project: 1,
      product_price: 1000000,
      service_price: 1000000,
      margin: 1000,
      estimated_closed_date: new Date(),
      estimated_delivered_date: new Date(),
      description: "Description",
      status: "ON GOING",
      file_url: "File URL",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should create new pipeline", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [newPipeline],
      });

      const result = await createPipeline(newPipeline);

      expect(result).toEqual(newPipeline);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if no rows are affected", async () => {
      const mockResult = { rowCount: 0, rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await expect(createPipeline(newPipeline)).rejects.toThrow(
        "No rows were affected."
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

      await expect(createPipeline(newPipeline)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe("Update pipeline", () => {
    const uuid = "7aaff58c-0000-0000-0000-3adfe69a3c1a";
    const updatedPipeline: Pipeline = {
      id_category_project: 2,
      uuid: "7aaff58c-0000-0000-0000-3adfe69a3c1a",
      project_name: "Test 2",
      id_user_sales: 2,
      id_end_user: 2,
      id_pic_project: 2,
      product_price: 2000000,
      service_price: 2000000,
      margin: 2000,
      estimated_closed_date: new Date(),
      estimated_delivered_date: new Date(),
      description: "Description",
      status: "ON GOING",
      file_url: "File URL",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("should update pipeline", async () => {
      const mockResult = { rowCount: 1, rows: [updatedPipeline] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await updatePipeline(uuid, updatedPipeline);

      expect(result).toEqual(updatedPipeline);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should return null if no rows are found", async () => {
      const mockResult = { rowCount: 0, rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await updatePipeline(uuid, updatedPipeline);

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

      await expect(updatePipeline(uuid, updatedPipeline)).rejects.toThrow(
        "Query failed"
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  describe("Delete pipeline", () => {
    const uuid = "7aaff58c-0000-0000-0000-3adfe69a3c1a";

    it("should delete pipeline", async () => {
      const mockResult = { rowCount: 1, rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      await deletePipeline(uuid);

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.pipelines WHERE uuid = $1",
        [uuid]
      );
    });

    it("should return null if no rows are affected", async () => {
      const mockResult = { rowCount: 0, rows: [] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await deletePipeline(uuid);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.pipelines WHERE uuid = $1",
        [uuid]
      );
    });

    it("should throw an error if the query fails", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error("Query failed")
      );

      await expect(deletePipeline(uuid)).rejects.toThrow("Query failed");
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM pipeline.pipelines WHERE uuid = $1",
        [uuid]
      );
    });
  });
});
