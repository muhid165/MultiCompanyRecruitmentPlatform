import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import { filterData } from "../../Utils/filterData";
import { ActivityLogType, Department, EntityType } from "@prisma/client";
import { logActivity } from "../../Utils/activityLog";

export const viewCreateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { companyId } = req.query; // companyId
    const { name, description } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }
    const department = await prisma.department.create({
      select: { id: true, companyId: true, name: true, description: true },
      data: {
        companyId: companyId as string,
        name,
        description,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.CREATED,
      entityType: EntityType.DEPARTMENT,
      description: `Created a department`,
      changes: { department: department.id },
    });

    return res
      .status(200)
      .json({ message: "Department created successfully ..", department });
  } catch (error) {
    next(error);
  }
};
export const viewUpdateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;

    const { deptId } = req.params; // departmentId
    const { name, description } = req.body;

    const department = await prisma.department.update({
      where: { id: deptId },
      data: {
        name,
        description,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.DEPARTMENT,
      description: `Updated a department`,
      changes: { department: department.id },
    });

    return res
      .status(200)
      .json({ message: "Department updated successfully ..", department });
  } catch (error) {
    next(error);
  }
};
export const viewCompanyDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }
    const departments = await prisma.department.findMany({
      select: { id: true, companyId: true, name: true, description: true },
      where: {
        companyId: companyId as string,
        isDeleted: false,
      },
      skip,
      take: limit,
    });
    const total = await prisma.department.count({
      where: { companyId: companyId as string, isDeleted: false },
    });
    if (total <= 0)
      return res.status(404).json({
        message: "No Departments found",
      });

    return res.status(200).json({
      page,
      tatalPages: Math.ceil(total / limit),
      totalItems: total,
      departments,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteDepartmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { deptId } = req.params;
    const existingDepartment = await prisma.department.findUnique({
      where: { id: deptId, isDeleted: false },
    });
    if (!existingDepartment)
      return res.status(400).json({ mesasge: "No department Found." });
    await prisma.department.update({
      where: {
        id: deptId,
      },
      data: {
        isDeleted: true,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.DELETED,
      entityType: EntityType.DEPARTMENT,
      description: `Deleted a department`,
      changes: { department: deptId },
    });

    return res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    next(error);
  }
};
export const viewDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { companyId, name } = req.query as {
      companyId?: string;
      name?: string;
    };

    // Step 1: Use reusable filter utility
    const result = (await filterData({
      model: prisma.department,
      query: req.query,
    })) as Department[];

    // Step 2: Custom response formatting
    let responseData: Partial<Department>[] = [];

    if (companyId && !name) {
      // Only companyId present → return department names only
      responseData = result.map((dept) => ({
        name: dept.name,
      }));
    } else if (companyId && name) {
      // Both companyId and name present → return id + name
      responseData = result.map((dept) => ({
        id: dept.id,
        name: dept.name,
      }));
    } else {
      // Default fallback if nothing passed
      responseData = result;
    }

    return res.status(200).json({
      message: "Filtered departments fetched successfully",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
