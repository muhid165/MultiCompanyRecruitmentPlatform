import { includes } from "zod";
import prisma from "../Config/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../Utils/generateToken";
import { comparePassword, hashPassword } from "../Utils/hashPassword";

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isDeleted: false,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      password: true,
      roleId: true,
      companyId: true,
      Role: {
        select: {
          code: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not Found.");
  if (!user.password) throw new Error("No password associated with user.");

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Credentials.");
  }

  const refreshToken = generateRefreshToken(user.id);
  const accessToken = generateAccessToken(user.email);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isActive: true,
      refreshToken,
    },
  });

  const userData = {
    id: user.id,
    fullName: user.fullName,
    token: accessToken,
    refreshToken: refreshToken,
    role: user.Role?.code,
    companyId: user.companyId,
  };

  return userData;
};
export const registerUser = async (
  email: string,
  fullName: string,
  password: string,
  phone: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const existingUserByPhone = await prisma.user.findUnique({
    where: { phone },
  });

  if (existingUserByPhone) {
    throw new Error("Phone already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    select: {
      id: true,
      roleId: true,
      fullName: true,
      email: true,
      phone: true,
      companyId: true,
      UserPermissions: {
        include: { Permission: { select: { codename: true } } },
      },
      GroupMember: { select: { groupId: true } },
      
    },
    data: {
      fullName,
      email,
      password: hashedPassword,
      phone,
    },
  });

  return user;
};
export const changeUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found...");

  if (newPassword != confirmPassword) {
    throw new Error("password and confirmPassword does not match");
  }

  const isOldPasswordValid = await comparePassword(oldPassword, user.password);

  if (!isOldPasswordValid) {
    throw new Error("Old password in incorrect");
  }
  if (isOldPasswordValid && oldPassword === newPassword) {
    throw new Error("New password cannot be the same as the old password");
  }
  const hashedPassword = await hashPassword(newPassword);
  // const accessToken = generateAccessToken(user.email);
  const refreshToken = generateRefreshToken(userId);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
      refreshToken,
    },
  });
};
