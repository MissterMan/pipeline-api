import express, { Router } from "express";
import {
  createPipelineController,
  deletePipelineController,
  getPipelineByIdController,
  getPipelineController,
  updatePipelineController,
} from "../controllers/pipelinesController";
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
} from "../controllers/usersController";
import {
  createEndUserController,
  deleteEndUserController,
  getEndUserByIdController,
  getEndUserController,
  updateEndUserController,
} from "../controllers/endUsersController";
import {
  createProjectCategoriesController,
  deleteProjectCategoriesController,
  getProjectCategoriesByIdController,
  getProjectCategoriesController,
  updateProjectCategoriesController,
} from "../controllers/projectCategoriesController";
import {
  approveChangeRequestController,
  createChangeRequestController,
  getChangeRequestContorller,
} from "../controllers/changeRequestController";
import { login } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";
import { checkIsAdmin } from "../middlewares/isAdminMiddleware";

export const router: Router = express.Router();

router.post("/login", login);

router.use(verifyToken);

// Pipeline route
router.get("/pipelines", getPipelineController);
router.get("/pipelines/:uuid", getPipelineByIdController);
router.post("/pipelines", createPipelineController);
router.put("/pipelines/:uuid", updatePipelineController);
router.delete("/pipelines/:uuid", deletePipelineController);

// User route
router.get("/users", getUsersController);
router.get("/users/:uuid", getUserByIdController);
router.post("/users", createUserController);
router.put("/users/:uuid", updateUserController);
router.delete("/users/:uuid", deleteUserController);

// End User route
router.get("/endusers", getEndUserController);
router.get("/endusers/:uuid", getEndUserByIdController);
router.post("/endusers", createEndUserController);
router.put("/endusers/:uuid", updateEndUserController);
router.delete("/endusers/:uuid", deleteEndUserController);

// Categories route
router.get("/project-categories", getProjectCategoriesController);
router.get("/project-categories/:uuid", getProjectCategoriesByIdController);
router.post("/project-categories", createProjectCategoriesController);
router.put("/project-categories/:uuid", updateProjectCategoriesController);
router.delete("/project-categories/:uuid", deleteProjectCategoriesController);

router.get("/change-request", getChangeRequestContorller);
router.post("/change-request", createChangeRequestController);
router.put(
  "/approve-change-request/:uuid",
  checkIsAdmin,
  approveChangeRequestController
);
