import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import strict from "assert/strict";
import { string } from "zod";

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
    const { name, websiteUrl, careerPageUrl, description, userId } = req.body;

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

    res.status(200).json({ message: "Company admins assigned successfully" });
  } catch (error) {
    next(error);
  }
};
// const viewCompanyDepartment = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params; // companyId
//     const departments = await prisma.department.findMany({
//       select: { companyId: true, name: true, description: true },
//       where: { companyId: id },
//     });

//     return res
//       .status(200)
//       .json({ message: "Company departments", departments });
//   } catch (error) {
//     next(error);
//   }
// };
// const viewCompanyJobs = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params; // companyId
//     const jobs = await prisma.job.findMany({
//       select: {
//         companyId: true,
//         departmentId: true,
//         title: true,
//         location: true,
//         experience: true,
//         salaryRange: true,
//         employmentType: true,
//         description: true,
//         responsibilities: true,
//         requirements: true,
//         createdById: true,
//         published: true,
//         status: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//       where: {
//         companyId: id,
//       },
//     });

//     return res.status(200).json({ message: "Company Jobs ", jobs });
//   } catch (error) {
//     next(error);
//   }
// };
