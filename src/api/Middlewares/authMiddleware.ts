import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../../Config/prisma";
import { JWTSECRET,REFRESH_TOKEN_SECRET } from "../../Config";


export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const refreshHeader = req.headers["x-refresh-token"]; // refresh token can be sent via header

  if (!authHeader)
    return res.status(401).json({ message: "Please login to continue." });

  const accessToken = authHeader.split(" ")[1];

  try {
    // ✅ 1. Verify Access Token
    const decoded = jwt.verify(accessToken, JWTSECRET) as JwtPayload;

    const existingUser = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!existingUser)
      return res.status(401).json({ message: "User not found." });

    (req as any).user = existingUser;
    return next();
  } catch (error: any) {
    
    if (error.name === "TokenExpiredError") {
      if (!refreshHeader)
        return res.status(401).json({ message: "Session expired. Please login again." });

      const refreshToken = refreshHeader as string;

      try {
        // ✅ 2. Verify Refresh Token
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload;

        const existingUser = await prisma.user.findUnique({
          where: { id: decodedRefresh.userId },
        });

        if (!existingUser || existingUser.refreshToken !== refreshToken) {
          return res.status(403).json({ message: "Invalid refresh token." });
        }

        // ✅ 3. Generate new Access Token
        const newAccessToken = jwt.sign(
          { id: existingUser.id, email: existingUser.email },
          JWTSECRET,
          { expiresIn: "15m" }
        );

        // Send new access token to client
        res.setHeader("x-access-token", newAccessToken);

        (req as any).user = existingUser;
        return next();
      } catch (refreshError) {
        return res.status(403).json({ message: "Invalid or expired refresh token." });
      }
    }

    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Authentication failed." });
  }
};

// export const isAuthenticated = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;
//   const refreshHeader = req.headers["x-refresh-token"];
//   if (!authHeader) return res.status(401).json({ message: "Please Login..." });
//   const accessToken = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(accessToken, JWTSECRET) as JwtPayload;

//     const existingUser = await prisma.user.findUnique({
//       where: { email: decoded.email },
//     });
//     if (!existingUser)
//       return res.status(401).json({ error: "User Not found.. " });

//     (req as any).user = existingUser;
//     return next();
//   } catch (error : any) {
//     if (error.name === "TokenExpiredError") {
//       if (!refreshHeader)
//         return res.status(401).json({ message: "Session expired. Please login again." });

//       const refreshToken = refreshHeader as string;

//     console.log(error);
//   }
// };


// Role Check Middleware (Keeping 403 for forbidden access)
export const checkUserRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user.userRole; 
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' }); // 403 for role-based access control
    }
  };
};

