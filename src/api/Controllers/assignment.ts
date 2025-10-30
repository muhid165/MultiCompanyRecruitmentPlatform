import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import { logActivity } from "../../Utils/activityLog";
import { ActivityLogType, EntityType } from "@prisma/client";

export const viewCreateAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUserId = (req as any).user?.id;
    const { companyId, userId } = req.body;

    // const companyExists = await prisma.company.findUnique({
    //   where: { id: companyId },
    // });
    // if (!companyExists) throw new Error("Company not Found");

    // const userExists = await prisma.user.findUnique({ where: { id: userId } });
    // if (!userExists) throw new Error("User not found");

    const existing = await prisma.tenantAssingment.findFirst({
      where: { companyId, userId },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "This user is already assigned to the company" });
    }

    const newAssignment = await prisma.tenantAssingment.create({
      data: { companyId, userId },
      include: {
        Company: { select: { id: true, name: true } },
        User: { select: { id: true, fullName: true, email: true } },
      },
    });

    await logActivity({
      userId: loggedInUserId,
      action: ActivityLogType.CREATED,
      entityType: EntityType.TENANT_ASSIGNMENT,
      entityId: userId,
      description: `Created a new Tenant`,
      changes: { companyId: companyId },
    });

    return res.status(201).json({
      message: "Assignment created successfully",
      data: newAssignment,
    });
  } catch (error) {
    next(error);
  }
};

export const viewUpdateAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUserId = (req as any).user?.id;

    const { id } = req.params;
    const { companyId, userId } = req.body;

    const assignment = await prisma.tenantAssingment.findUnique({
      where: { id },
    });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const updated = await prisma.tenantAssingment.update({
      where: { id },
      data: {
        companyId,
        userId,
      },
      include: {
        Company: { select: { id: true, name: true } },
        User: { select: { id: true, fullName: true, email: true } },
      },
    });

    await logActivity({
      userId: loggedInUserId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.TENANT_ASSIGNMENT,
      entityId: userId,
      description: `Updated a Tenant`,
      changes: { companyId: companyId },
    });

    return res
      .status(200)
      .json({ message: "Assignment updated successfully", data: updated });
  } catch (error) {
    next(error);
  }
};

export const viewAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [assignments, total] = await Promise.all([
      prisma.tenantAssingment.findMany({
        skip,
        take: limit,
        include: {
          Company: { select: { id: true, name: true } },
          User: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.tenantAssingment.count(),
    ]);

    return res.status(200).json({
      message: "Tenant assignments fetched successfully",
      page,
      tatalPages: Math.ceil(total / limit),
      totalItems: total,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

export const viewAssignmentsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const assignment = await prisma.tenantAssingment.findUnique({
      where: { id },
      include: {
        Company: { select: { id: true, name: true } },
        User: { select: { id: true, fullName: true, email: true } },
      },
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    return res.status(200).json({
      message: "Tenant assignment fetched successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

export const viewDeleteAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const { id } = req.params;

    const assignment = await prisma.tenantAssingment.findUnique({
      where: { id },
    });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await prisma.tenantAssingment.delete({ where: { id } });

    await logActivity({
      userId: userId,
      action: ActivityLogType.DELETED,
      entityType: EntityType.TENANT_ASSIGNMENT,
      entityId: assignment.userId,
      description: `Deleted a Tenant`,
      changes: { companyId: assignment.companyId },
    });

    return res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
