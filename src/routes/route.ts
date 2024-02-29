import express, { Router } from "express";
import {
  getPipelineByIdController,
  getPipelineController,
} from "../controllers/pipelinesController";
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
} from "../controllers/usersController";

export const router: Router = express.Router();

router.get("/pipelines", getPipelineController);
router.get("/pipelines/:uuid", getPipelineByIdController);

// User route
router.get("/users", getUsersController);
router.get("/users/:uuid", getUserByIdController);
router.post("/users", createUserController);
router.put("/users/:uuid", updateUserController);
router.delete("/users/:uuid", deleteUserController);
