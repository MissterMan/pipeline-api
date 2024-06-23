import { JwtPayload } from "./authMiddleware"; // Pastikan file authMiddleware.ts sudah memiliki interface JwtPayload

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
