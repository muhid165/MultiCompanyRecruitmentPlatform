import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";

export const viewCreateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params; // companyId
    const { name, description } = req.body;

    const department = await prisma.department.create({
      data: {
        companyId: companyId,
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
    const { companyId } = req.params; //companyId
    const departments = await prisma.department.findMany({
      select: { companyId: true, name: true, description: true },
      where: {
        companyId: companyId,
        isDeleted: false,
      },
    });
    return res
      .status(200)
      .json({ message: "Company departments.", departments });
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
      where: { id: deptId },
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
