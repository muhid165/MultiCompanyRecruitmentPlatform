import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";

export const viewCreateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    const { deptId } = req.params; // departmentId
    const { name, description } = req.body;

    const department = await prisma.department.update({
      where: { id: deptId },
      data: {
        name,
        description,
      },
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
    return res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    next(error);
  }
};
