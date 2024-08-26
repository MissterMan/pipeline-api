import { Request, Response, NextFunction } from "express";
import { checkIsAdmin } from "../../src/middlewares/isAdminMiddleware";
import { response } from "../../src/utils/response";

// Mock the response utility function
jest.mock("../../src/utils/response");

describe("checkIsAdmin middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: { id: "1", email: "email@mail", name: "test", role: "admin" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next if user is admin", () => {
    req.user!.role = "admin";

    checkIsAdmin(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(response).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", () => {
    req.user!.role = "user";

    checkIsAdmin(req as Request, res as Response, next);

    expect(response).toHaveBeenCalledWith(403, "Error", "Forbidden", res);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if user role is undefined", () => {
    req.user = undefined;

    checkIsAdmin(req as Request, res as Response, next);

    expect(response).toHaveBeenCalledWith(403, "Error", "Forbidden", res);
    expect(next).not.toHaveBeenCalled();
  });
});
