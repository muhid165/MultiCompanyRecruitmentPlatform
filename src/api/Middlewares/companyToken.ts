import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { COMPANY_TOKEN_SECRET } from "../../Config/index";

// Extend Request type to hold company info
declare global {
  namespace Express {
    interface Request {
      companyId?: string;
    }
  }
}

export const verifyCompanyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const secret = COMPANY_TOKEN_SECRET;

    const decoded = jwt.verify(token, secret) as { companyId: string };
    req.companyId = decoded.companyId;

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
