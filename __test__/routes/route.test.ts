import express from "express";
import request from "supertest";
import { router } from "../../src/routes/route";

// Mock controllers
jest.mock("../../src/controllers/pipelinesController", () => ({
  getPipelineController: jest.fn(async (req, res) =>
    res.status(200).send("getPipeline")
  ),
  getPipelineByIdController: jest.fn(async (req, res) =>
    res.status(200).send("getPipelineById")
  ),
  createPipelineController: jest.fn(async (req, res) =>
    res.status(201).send("createPipeline")
  ),
  updatePipelineController: jest.fn(async (req, res) =>
    res.status(200).send("updatePipeline")
  ),
  deletePipelineController: jest.fn(async (req, res) =>
    res.status(204).send("deletePipeline")
  ),
}));

jest.mock("../../src/controllers/usersController", () => ({
  getUsersController: jest.fn(async (req, res) =>
    res.status(200).send("getUsers")
  ),
  getUserByIdController: jest.fn(async (req, res) =>
    res.status(200).send("getUserById")
  ),
  createUserController: jest.fn(async (req, res) =>
    res.status(201).send("createUser")
  ),
  updateUserController: jest.fn(async (req, res) =>
    res.status(200).send("updateUser")
  ),
  deleteUserController: jest.fn(async (req, res) =>
    res.status(204).send("deleteUser")
  ),
}));

jest.mock("../../src/controllers/authController", () => ({
  login: jest.fn(async (req, res) => res.status(200).send("login")),
}));

jest.mock("../../src/middlewares/authMiddleware", () => ({
  verifyToken: jest.fn((req, res, next) => next()),
}));

jest.mock("../../src/middlewares/isAdminMiddleware", () => ({
  checkIsAdmin: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use("/", router);

describe("Route Tests", () => {
  it("should call login controller", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "user", password: "pass" });
    expect(response.status).toBe(200);
    expect(response.text).toBe("login");
  });

  it("should call getPipelineController", async () => {
    const response = await request(app).get("/pipelines");
    expect(response.status).toBe(200);
    expect(response.text).toBe("getPipeline");
  });

  it("should call getPipelineByIdController", async () => {
    const response = await request(app).get("/pipelines/123");
    expect(response.status).toBe(200);
    expect(response.text).toBe("getPipelineById");
  });

  it("should call createPipelineController", async () => {
    const response = await request(app)
      .post("/pipelines")
      .send({ name: "New Pipeline" });
    expect(response.status).toBe(201);
    expect(response.text).toBe("createPipeline");
  });

  it("should call updatePipelineController", async () => {
    const response = await request(app)
      .put("/pipelines/123")
      .send({ name: "Updated Pipeline" });
    expect(response.status).toBe(200);
    expect(response.text).toBe("updatePipeline");
  });

  it("should call deletePipelineController", async () => {
    const response = await request(app).delete("/pipelines/123");
    expect(response.status).toBe(204);
  });

  it("should call getUsersController", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.text).toBe("getUsers");
  });

  it("should call getUserByIdController", async () => {
    const response = await request(app).get("/users/123");
    expect(response.status).toBe(200);
    expect(response.text).toBe("getUserById");
  });

  it("should call createUserController", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "New User" });
    expect(response.status).toBe(201);
    expect(response.text).toBe("createUser");
  });

  it("should call updateUserController", async () => {
    const response = await request(app)
      .put("/users/123")
      .send({ name: "Updated User" });
    expect(response.status).toBe(200);
    expect(response.text).toBe("updateUser");
  });

  it("should call deleteUserController", async () => {
    const response = await request(app).delete("/users/123");
    expect(response.status).toBe(204);
  });
});
