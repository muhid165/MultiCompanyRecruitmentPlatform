import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";

//USER MANAGEMENT ACCROSS COMPANIES  // 1 controller remaining
export const viewAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        companyId: true,
        Role: {
          select: {
            code: true,
          },
        },
      },
      where: {
        isDeleted: false,
      },
      skip,
      take: limit,
    });

    const total = await prisma.user.count({ where: { isDeleted: false } });
    if (total <= 0)
      return res.status(404).json({
        message: "No Users found",
      });

    return res.status(200).json({
      page,
      tatalPages: Math.ceil(total / limit),
      totalItems: total,
      users,
    });
  } catch (error) {
    next(error);
  }
};
export const viewUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        companyId: true,
        Role: {
          select: {
            code: true,
          },
        },
      },
      where: {
        id: id,
        isDeleted: false,
      },
    });

    if (!user) throw new Error("No user found with ID");

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
export const viewUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log("this is request :- ",req.body);
    const { fullName, email, phone, companyId, role } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
        isDeleted: false,
      },
    });
    if (!user) throw new Error("No user found with ID");
    const existingRole = await prisma.role.findFirst({
      where: { code: role },
    });
    if (!existingRole) throw new Error("No Role found with Code");

    const updatedUser = await prisma.user.update({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        companyId: true,
        Role: {
          select: {
            code: true,
          },
        },
      },
      where: { id: id },
      data: { fullName, email, phone, companyId, roleId: existingRole.id },
    });
    return res
      .status(200)
      .json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user || user.isDeleted === true)
      throw new Error("No user found with ID");

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};
export const assingRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!role) throw new Error("No role with ID");

    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new Error("No user found with ID");

    await prisma.user.update({
      where: { id },
      data: {
        roleId: roleId,
      },
    });

    return res
      .status(200)
      .json({ message: "Role assinged to User successfully " });
  } catch (error) {
    next(error);
  }
};
