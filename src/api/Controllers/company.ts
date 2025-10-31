import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import { ActivityLogType, Company, EntityType, User } from "@prisma/client";
import { filterData } from "../../Utils/companyFilterData";
// import { filterData } from "../../Utils/filterData";
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
      select: {
        id: true,
        name: true,
        logoUrl: true,
        websiteUrl: true,
        careerPageUrl: true,
        description: true,
        status: true,
        location: true,
      },
      where: {
        isDeleted: false,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
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
    const userId = (req as any).user?.id;
    const { name, websiteUrl, careerPageUrl, location, description } = req.body;

    // logoUrl will be fileupload path
    if (!req.file)
      return res.status(400).json({ message: "Logo file is required.." });
    const logoUrl = `/files/${req.file.filename}`;

    const existingCareerPage = await prisma.company.findUnique({
      where: {
        careerPageUrl,
      },
    });

    if (existingCareerPage)
      throw new Error("Career Page URL already exists for another company.");

    const company = await prisma.company.create({
      data: {
        name,
        websiteUrl,
        logoUrl: logoUrl,
        careerPageUrl,
        location,
        description,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.CREATED,
      entityType: EntityType.COMPANY,
      description: `Created company "${company.name}".`,
      changes: { companyId: company.id },
    });

    return res
      .status(201)
      .json({ message: "Company created successfully.", company });
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
    const userId = (req as any).user?.id;
    const companyId = req.params.id;
    const {
      name,
      websiteUrl,
      careerPageUrl,
      description,
      location,
      logoUrl: bodyLogoUrl,
    } = req.body;

    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!existingCompany) {
      return res.status(404).json({ message: "Company not found." });
    }

    let logoUrl: string | undefined = existingCompany.logoUrl ?? undefined;

    if (req.file) {
      // Case 1: new file uploaded
      logoUrl = `/files/${req.file.filename}`;
    } else if (bodyLogoUrl && bodyLogoUrl.trim() !== "") {
      // Case 2: body contains existing logo URL
      logoUrl = bodyLogoUrl.trim();
    }
    // } else {
    //   // Case 3: nothing sent → keep existing
    //   logoUrl = existingCompany.logoUrl;
    // }

    // const logoUrl = `${req.protocol}://${req.get("host")}/files/${
    //   req.file.filename
    // }`;

    if (careerPageUrl && careerPageUrl !== existingCompany.careerPageUrl) {
      const duplicate = await prisma.company.findUnique({
        where: { careerPageUrl },
      });
      if (duplicate)
        throw new Error("Career Page URL already exists for another company.");
    }

    const updatedCompany = await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        name,
        websiteUrl,
        logoUrl,
        careerPageUrl,
        description,
        location,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.COMPANY,
      description: `Updated company "${updatedCompany.name}".`,
      changes: { companyId: companyId },
    });

    return res
      .status(200)
      .json({ message: "Company updated successfully.", updatedCompany });
  } catch (error) {
    console.log("Error: ", error);
    next(error);
  }
};
export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const companyId = req.params.id;
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });
    if (!company || company.isDeleted === true)
      throw new Error("No Company with ID.");
    await prisma.company.update({
      where: { id: companyId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.DELETED,
      entityType: EntityType.COMPANY,
      description: `deleted a company`,
      changes: { companyId: companyId },
    });

    return res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    next(error);
  }
};
export const viewCompanyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.params.id;
    const company = await prisma.company.findUnique({
      select: {
        name: true,
        logoUrl: true,
        websiteUrl: true,
        careerPageUrl: true,
        description: true,
        location: true,
        _count: {
          select: {
            Department: true,
            Jobs: true,
            Applications: true,
          },
        },
        // Department: true,
        // Jobs: true,
        // Applications: true,
      },
      where: {
        id: companyId,
        isDeleted: false,
      },
    });
    return res.status(200).json({ company });
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
      query: { ...req.query, isDeleted: false },
    })) as { data: Company[] };

    // Step 2: Format response based on query params
    let responseData: Partial<Company>[] = [];

    if (!name) {
      // Case 1 → Only fetch all company names
      responseData = result.data.map((comp) => ({
        id: comp.id,
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
export const viewSearchCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const companies = await prisma.company.findMany({
      where: {
        OR: [{ name: { contains: query, mode: "insensitive" } }],
        isDeleted: false,
      },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({
      companies,
    });
  } catch (error) {
    next(error);
  }
};
export const viewDeleteBulkCompanies = async (
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

    await prisma.company.updateMany({
      where: { id: { in: ids } },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    for (const id of ids) {
      await logActivity({
        userId: userId,
        action: ActivityLogType.DELETED,
        entityType: EntityType.COMPANY,
        entityId: id,
        description: `Deleted Bulk Companies ids`,
      });
    }

    return res.status(200).json({ message: "Companies Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

