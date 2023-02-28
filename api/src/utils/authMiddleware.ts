import { NextFunction, Response } from "express";
import { ServiceRequest } from "../interfaces";
import { verifyToken } from "./jwt";

class AuthMiddleware {
  async auth(req: ServiceRequest, res: Response, next: NextFunction) {
    try {
      const { __ } = req.signedCookies;
      const tokenInfo = verifyToken(__);
      req.loginInfo = tokenInfo;
      next();
    } catch {
      res.sendStatus(401);
    }
  }
}
export const authMiddleware = new AuthMiddleware();
