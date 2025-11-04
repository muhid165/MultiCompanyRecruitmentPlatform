import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  changeUserPassword,
  loginUser,
  registerUser,
} from "../../Services/auth";
import prisma from "../../Config/prisma";
import { sendEmail } from "../../Services/mail";
import { REFRESH_TOKEN_SECRET } from "../../Config";
import { generateAccessToken } from "../../Utils/generateToken";
import { logActivity } from "../../Utils/activityLog";
import { ActivityLogType, EntityType } from "@prisma/client";

export const viewLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    return res.status(200).json({ message: "LoggedIn successfull, ", user });
  } catch (error) {
    next(error);
  }
};
export const viewRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const { fullName, email, phone, roleId } = req.body;
    const tempPassword = Math.random().toString(36).slice(-8);
    console.log(`This is the password for ${fullName}:  ${tempPassword}`);
    const user = await registerUser(
      email,
      fullName,
      tempPassword,
      phone,
      roleId
    );
    await sendEmail(email, fullName, tempPassword);

    await logActivity({
      userId: userId,
      action: ActivityLogType.CREATED,
      entityType: EntityType.USER,
      entityId: user?.id,
      description: `Registered a User`,
      changes: { fullName: fullName, email: email },
    });
    return res.status(201).json({
      message: "User created successfully. Login credentials sent via email.",
      user,
    });
  } catch (error) {
    next(error);
  }
};
export const viewProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const user = await prisma.user.findUnique({
      select: {
        fullName: true,
        email: true,
        phone: true,
        UserPermissions: true,
        GroupMember: true,
        refreshToken: true,
        companyId: true,
        Role: {
          select: { code: true },
        },
      },
      where: { id: userId },
    });

    res.status(200).json({ message: "Profile Retrieved", user });
  } catch (error) {
    next(error);
  }
};
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const { oldPassword, password, cPassword } = req.body;
    const cUser = await changeUserPassword(
      userId,
      oldPassword,
      password,
      cPassword
    );

    await logActivity({
      userId: userId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.USER,
      description: `Updated user password`,
    });

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};
export const viewRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string);

    if (typeof payload === "string" || !payload.userId) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user.email);
    
    res.status(200).json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(440).json({ message: "Refresh token has expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid refresh token" });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
