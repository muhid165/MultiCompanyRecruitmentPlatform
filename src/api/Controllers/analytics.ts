import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";

export const viewGlobalAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [companyCount, departmentCount, jobCount, applicationCount] =
      await Promise.all([
        prisma.company.count(),
        prisma.department.count(),
        prisma.job.count(),
        prisma.application.count(),
      ]);

    return res.status(200).json({
      message: "Global analytics fetched successfully",
      data: {
        companies: companyCount,
        departments: departmentCount,
        jobs: jobCount,
        applications: applicationCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const viewCompanyAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;

    // Check if company exists
    const companyExists = await prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!companyExists)
      return res.status(404).json({ message: "Company not found" });

    const [departmentCount, jobCount, applicationCount] = await Promise.all([
      prisma.department.count({ where: { companyId, isDeleted: false } }),
      prisma.job.count({ where: { companyId, isDeleted: false } }),
      prisma.application.count({ where: { companyId, isDeleted: false } }),
    ]);

    return res.status(200).json({
      message: "Company analytics fetched successfully",
      data: {
        companyId,
        companyName: companyExists.name,
        departments: departmentCount,
        jobs: jobCount,
        applications: applicationCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

