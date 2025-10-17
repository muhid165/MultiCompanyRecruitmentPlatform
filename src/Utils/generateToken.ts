import jwt from "jsonwebtoken";
import { JWTSECRET, REFRESH_TOKEN_SECRET } from "../Config/index";

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET as string, { expiresIn: '30d' });
};

export const generateAccessToken = (email: string): string => {
  const token = jwt.sign({ email }, JWTSECRET as string, { expiresIn: '7h' });
   return token;
};