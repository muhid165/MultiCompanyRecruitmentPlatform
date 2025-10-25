import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import { logActivity } from "../../Utils/activityLog";
import { ActivityLogType, EntityType } from "@prisma/client";

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
    const userId = (req as any).user.id;

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

    await logActivity({
      userId: userId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.USER,
      entityId: user.id,
      description: `Updated a User`,
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
    const userId = (req as any).user.id;
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

    await logActivity({
      userId: userId,
      action: ActivityLogType.DELETED,
      entityType: EntityType.USER,
      entityId: user.id,
      description: `Deleted a User`,
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
    const userId = (req as any).user.id;

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

    await logActivity({
      userId: userId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.USER,
      entityId: user.id,
      description: `Assigned a Role to a user`,
    });

    return res
      .status(200)
      .json({ message: "Role assinged to User successfully " });
  } catch (error) {
    next(error);
  }
};
export const viewSearchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        isDeleted: false,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
      },
      orderBy: { fullName: "asc" },
    });

    return res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const viewDeleteBulkUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ids: string[] = req.body.ids;
    const userId = (req as any).user.userId;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided for deletion" });
    }

    await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    for (const id of ids) {
      await logActivity({
        userId: userId,
        action: ActivityLogType.DELETED,
        entityType: EntityType.USER,
        entityId: id,
        description: `Deleted Bulk users ids`,
      });
    }

    return res
      .status(200)
      .json({ message: "Users Deleted successfully" });
  } catch (err) {
    next(err);
  }
};