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

router.post("/login", (req, res, next) => {
  login(req, res).catch(next);
});

router.use(verifyToken);

// Pipeline route
router.get("/pipelines", (req, res, next) => {
  getPipelineController(req, res).catch(next);
});
router.get("/pipelines/:uuid", (req, res, next) => {
  getPipelineByIdController(req, res).catch(next);
});
router.post("/pipelines", (req, res, next) => {
  createPipelineController(req, res).catch(next);
});
router.put("/pipelines/:uuid", (req, res, next) => {
  updatePipelineController(req, res).catch(next);
});
router.delete("/pipelines/:uuid", (req, res, next) => {
  deletePipelineController(req, res).catch(next);
});

// User route
router.get("/users", (req, res, next) => {
  getUsersController(req, res).catch(next);
});
router.get("/users/:uuid", (req, res, next) => {
  getUserByIdController(req, res).catch(next);
});
router.post("/users", (req, res, next) => {
  createUserController(req, res).catch(next);
});
router.put("/users/:uuid", (req, res, next) => {
  updateUserController(req, res).catch(next);
});
router.delete("/users/:uuid", (req, res, next) => {
  deleteUserController(req, res).catch(next);
});

// End User route
router.get("/endusers", (req, res, next) => {
  getEndUserController(req, res).catch(next);
});
router.get("/endusers/:uuid", (req, res, next) => {
  getEndUserByIdController(req, res).catch(next);
});
router.post("/endusers", (req, res, next) => {
  createEndUserController(req, res).catch(next);
});
router.put("/endusers/:uuid", (req, res, next) => {
  updateEndUserController(req, res).catch(next);
});
router.delete("/endusers/:uuid", (req, res, next) => {
  deleteEndUserController(req, res).catch(next);
});

// Categories route
router.get("/project-categories", (req, res, next) => {
  getProjectCategoriesController(req, res).catch(next);
});
router.get("/project-categories/:uuid", (req, res, next) => {
  getProjectCategoriesByIdController(req, res).catch(next);
});
router.post("/project-categories", (req, res, next) => {
  createProjectCategoriesController(req, res).catch(next);
});
router.put("/project-categories/:uuid", (req, res, next) => {
  updateProjectCategoriesController(req, res).catch(next);
});
router.delete("/project-categories/:uuid", (req, res, next) => {
  deleteProjectCategoriesController(req, res).catch(next);
});

// Change Request routes
router.get("/change-request", (req, res, next) => {
  getChangeRequestContorller(req, res).catch(next);
});
router.post("/change-request", (req, res, next) => {
  createChangeRequestController(req, res).catch(next);
});
router.put("/approve-change-request/:uuid", checkIsAdmin, (req, res, next) => {
  approveChangeRequestController(req, res).catch(next);
});
