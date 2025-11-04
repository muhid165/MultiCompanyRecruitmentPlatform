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
    const userId = (req as any).user?.id;
    const { companyId } = req.query; // companyId
    const { name, description } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const exists = await prisma.department.findFirst({
      where: { name, companyId: companyId as string, isDeleted: false },
    });
    if (exists)
      return res.status(409).json({ message: "Department already exists" });

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
    const userId = (req as any).user?.id;

    const deptId = req.params.id; // departmentId
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
      totalPages: Math.ceil(total / limit),
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
    const userId = (req as any).user?.id;
    const deptId = req.params.id;
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
        deletedAt: new Date(),
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

    const result = (await filterData({
      model: prisma.department,
      query: { ...req.query, isDeleted: false },
      defaultSortBy: "name",
      defaultOrder: "asc",
    })) as { data: Department[] };

    // let responseData: Partial<Department>[] = [];
    const responseData = result.data.map((dept: Department) => ({
      id: dept.id,
      name: dept.name,
    }));

    return res.status(200).json({
      message: "Filtered departments fetched successfully",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

export const viewSearchDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query, id } = req.query;

    if (
      !id ||
      typeof id !== "string" ||
      !query ||
      typeof query !== "string" ||
      query.trim() === ""
    ) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const departments = await prisma.department.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
        companyId: id,
        isDeleted: false,
      },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({
      departments,
    });
  } catch (error) {
    next(error);
  }
};

export const viewDeleteBulkDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ids: string[] = req.body.ids;
    const userId = (req as any).user?.id;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided for deletion" });
    }

    await prisma.department.updateMany({
      where: { id: { in: ids } },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    for (const id of ids) {
      await logActivity({
        userId: userId,
        action: ActivityLogType.DELETED,
        entityType: EntityType.DEPARTMENT,
        entityId: id,
        description: `Deleted Bulk Department ids`,
      });
    }

    return res
      .status(200)
      .json({ message: "Departments Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
