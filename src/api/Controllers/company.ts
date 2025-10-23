import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import strict from "assert/strict";
import { string } from "zod";
import { ActivityLogType, Company, EntityType, User } from "@prisma/client";
import { filterData } from "./filter";
import { logActivity } from "../../Utils/activityLog";

//COMPANY
export const viewAllCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const companies = await prisma.company.findMany({
      where: {
        isDeleted: false,
      },
      skip,
      take: limit,
    });
    const total = await prisma.company.count({ where: { isDeleted: false } });
    if (total <= 0)
      return res.status(404).json({
        message: "No Company found",
      });
    return res.status(200).json({
      page,
      tatalPages: Math.ceil(total / limit),
      totalItems: total,
      companies,
    });
  } catch (error) {
    next(error);
  }
};
export const viewCreateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { name, websiteUrl, careerPageUrl, description } = req.body;

    // logoUrl will be fileupload path
    if (!req.file) return res.status(400).json({ message: "No File Found.." });
    const filePath = `./public/temp/${req.file.filename}`;

    const existingCareerPage = await prisma.company.findUnique({
      where: {
        careerPageUrl,
      },
    });

    if (existingCareerPage)
      throw new Error("No duplicate CareerPageUrl's allowed.");

    const company = await prisma.company.create({
      data: {
        name,
        websiteUrl,
        logoUrl: filePath,
        careerPageUrl,
        description,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.CREATED,
      entityType: EntityType.COMPANY,
      description: `Created a compamny `,
      changes: { companyId: company.id },
    });

    return res.status(201).json({ message: "Company created successfully." });
  } catch (error) {
    next(error);
  }
};
export const viewUpdateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { name, websiteUrl, careerPageUrl, description } = req.body;

    if (!req.file) return res.status(400).json({ message: "No File Found.." });
    const filePath = `./public/temp/${req.file.filename}`;

    const updatedCompany = await prisma.company.update({
      select: {
        id: true,
        name: true,
        logoUrl: true,
        websiteUrl: true,
        careerPageUrl: true,
        description: true,
      },
      where: {
        id: id,
      },
      data: {
        name,
        websiteUrl,
        logoUrl: filePath,
        careerPageUrl,
        description,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.COMPANY,
      description: `Updated a company`,
      changes: { companyId: id },
    });

    return res
      .status(201)
      .json({ message: "Company updated successfully.", updatedCompany });
  } catch (error) {
    next(error);
  }
};
export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: {
        id: id,
      },
    });
    if (!company || company.isDeleted === true)
      throw new Error("No Company with ID.");
    await prisma.company.update({
      where: { id: id },
      data: {
        isDeleted: true,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.DELETED,
      entityType: EntityType.COMPANY,
      description: `deleted a company`,
      changes: { companyId: id },
    });

    return res.status(200).json({ message: "company deleted successfully" });
  } catch (error) {
    next(error);
  }
};
// no need till now
export const viewCompanyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;
    console.log("this is company ID -> ", companyId);
    const company = await prisma.company.findUnique({
      select: {
        name: true,
        logoUrl: true,
        websiteUrl: true,
        careerPageUrl: true,
        description: true,
        Department: true,
        Jobs: true,
        Applications: true,
      },
      where: {
        id: companyId,
      },
    });
    return res.status(200).json({ company });
  } catch (error) {
    next(error);
  }
};
export const assingCompanyAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { companyId } = req.query;
    const { roleId, adminIds } = req.body;

    const company = await prisma.company.findUnique({
      where: { id: companyId as string },
    });
    if (!company) return res.status(404).json({ message: "Company not found" });

    await prisma.user.updateMany({
      where: { id: { in: adminIds } },
      data: { companyId: companyId as string, roleId },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.ASSIGNED,
      entityType: EntityType.COMPANY,
      description: `Assigned a company to a user `,
      changes: { adminIds: adminIds, companyId: companyId },
    });

    res.status(200).json({ message: "Company admins assigned successfully" });
  } catch (error) {
    next(error);
  }
};
export const viewFilterCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { name } = req.query as {
      name?: string;
    };

    // Step 1: Use reusable filter utility
    const result = (await filterData({
      model: prisma.company,
      query: req.query,
    })) as { data: Company[] };

    // Step 2: Format response based on query params
    let responseData: Partial<Company>[] = [];

    if (!name) {
      // Case 1 → Only fetch all company names
      responseData = result.data.map((comp) => ({
        name: comp.name,
      }));
    } else if (name) {
      // Case 2 → Fetch specific company ID and name
      responseData = result.data.map((comp) => ({
        id: comp.id,
        name: comp.name,
      }));
    }

    return res.status(200).json({
      message: "Filtered companies fetched successfully",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
