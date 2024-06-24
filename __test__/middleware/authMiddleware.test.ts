import request from "supertest";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../src/middlewares/authMiddleware";
import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: envPath });

const app = express();
app.use(express.json());
app.get("/protected", verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ message: "Protected route accessed", user: req.user });
});

describe("verifyToken Middleware", () => {
  let jwtSecretKey: string;

  beforeAll(() => {
    jwtSecretKey = process.env.JWT_SECRET as string;
  });

  it("should deny access when no token is provided", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Access denied, no token provided");
  });

  it("should deny access when token is invalid", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should grant access when token is valid", async () => {
    const payload = {
      id: "123",
      email: "test@example.com",
      name: "Test User",
      role: "admin",
    };
    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "1h" });

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Protected route accessed");
    expect(res.body.user).toMatchObject(payload);
  });
});
