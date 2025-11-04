import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import { filterData } from "../../Utils/filterData";
import { ActivityLogType, EntityType, Job } from "@prisma/client";
import { logActivity } from "../../Utils/activityLog";
import { normalizeQuery } from "../../Utils/normalizeQuery";
import { buildPrismaFilters } from "../../Utils/buildPrismaFilters";

export const viewCreateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const { companyId } = req.query;
    const {
      department,
      location,
      experience,
      salaryRange,
      employmentType,
      description,
      content 
    } = req.body;

    const existingDepartment = await prisma.department.findFirst({
      where: {
        companyId: companyId as string,
        id: department,
      },
    });
    if (!existingDepartment) throw new Error("No Department in company");
    const job = await prisma.job.create({
      data: {
        companyId: companyId as string,
        departmentId: existingDepartment.id,
        location,
        experience,
        salaryRange,
        employmentType,
        description,
        content,
        createdById: userId,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.CREATED,
      entityType: EntityType.JOB,
      description: `Created a job`,
      changes: { jobId: job.id },
    });

    return res
      .status(201)
      .json({ message: " job created successfully..", job });
  } catch (error) {
    next(error);
  }
};
export const viewUpdateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const jobId = req.params.id;
    const {
      departmentId,
      location,
      experience,
      salaryRange,
      employmentType,
      description,
      content,
      status,
    } = req.body;

    let published = false;
    if (status === "ACTIVE") {
      published = true;
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
        isDeleted: false,
      },
    });
    if (!job) return res.status(400).json({ message: "Job not found " });

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        departmentId,
        location,
        experience,
        salaryRange,
        employmentType,
        description,
        content,
        status,
        published,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.JOB,
      description: `Updated a job`,
      changes: { jobId: job.id },
    });

    return res
      .status(200)
      .json({ message: "Job updated successfully.", updatedJob });
  } catch (error) {
    next(error);
  }
};


export const viewCompanyJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const schemaFields = {
      companyId: { type: "string" as const },
      name: {
        type: "string" as const,
        path: ["Department", "name"],
      },
      employmentType: {
        type: "enum" as const,
        enumValues: ["FULL_TIME", "CONTRACT", "INTERNSHIP"],
      },
      status: {
        type: "enum" as const,
        enumValues: ["DRAFT", "ACTIVE", "CLOSED"],
      },
    };

    const normalized = normalizeQuery(req.query);
    const filters: any = buildPrismaFilters(normalized, schemaFields);

    // Fix for companyId (UUID exact match) ---
    if (normalized.companyId) {
      filters.companyId = { equals: normalized.companyId };
    }

    if (normalized.published !== undefined) {
      const pubVal = normalized.published.toLowerCase();
      if (pubVal === "true" || pubVal === "false") {
        filters.published = pubVal === "true";
      }
    }

    filters.isDeleted = false;

    // console.log("Final job filters:", filters);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        select: {
          id: true,
          companyId: true,
          Department: { select: { id: true, name: true } },
          location: true,
          experience: true,
          salaryRange: true,
          employmentType: true,
          description: true,
          content: true,
          CreatedBy: { select: { id: true } },
          published: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        where: filters,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.job.count({ where: filters }),
    ]);

    if (total === 0) {
      return res.status(404).json({ message: "No Job found" });
    }

    return res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const viewPublishedCompanyJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        companyId: true,
        departmentId: true,
        location: true,
        experience: true,
        salaryRange: true,
        employmentType: true,
        description: true,
        content: true,
        CreatedBy: { select: { id: true } },
        published: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        companyId: companyId as string,
        published: true,
        status: "ACTIVE",
      },
      skip,
      take: limit,
    });

    const total = await prisma.job.count({
      where: {
        companyId: companyId as string,
        published: true,
        status: "ACTIVE",
      },
    });
    if (total <= 0)
      return res.status(404).json({
        message: "No Job found",
      });

    return res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};
export const viewDeleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.id;
    const jobId = req.params.id; // jobId
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
        isDeleted: false,
      },
    });
    if (!job) return res.status(400).json({ message: "No job found .." });
    await prisma.job.update({
      where: { id: jobId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: "CLOSED",
        published: false,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.DELETED,
      entityType: EntityType.JOB,
      description: `Deleted a job`,
      changes: { jobId: job.id },
    });

    return res.status(200).json({ message: "Job deleted successfully " });
  } catch (error) {
    next(error);
  }
};
export const filterJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { companyId } = req.query as { companyId?: string };

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const result = await filterData({
      model: prisma.job,
      query: { companyId, isDeleted: false },
      defaultSortBy: "description",
      defaultOrder: "asc",
    });

    const responseData = result.data.map((job: Job) => ({
      id: job.id,
      name: job.description,
    }));

    return res.status(200).json({
      message: "Job Title dropdown data fetched successfully",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
export const viewSearchJobs = async (
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

    const jobs = await prisma.job.findMany({
      where: {
        OR: [{ description: { contains: query, mode: "insensitive" } }],
        companyId: id,
        isDeleted: false,
      },
      orderBy: { description: "asc" },
    });

    return res.status(200).json({
      jobs,
    });
  } catch (error) {
    next(error);
  }
};
export const viewJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobId = req.params.id;

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
        isDeleted: false,
      },
    });

    if (!job) throw new Error(`No job found with ID: ${jobId}`);

    return res.status(200).json({
      message: "Job fetched successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};
export const viewDeleteBulkjobs = async (
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

    await prisma.job.updateMany({
      where: { id: { in: ids } },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: "CLOSED",
        published: false,
      },
    });

    for (const id of ids) {
      await logActivity({
        userId: userId,
        action: ActivityLogType.DELETED,
        entityType: EntityType.JOB,
        entityId: id,
        description: `Deleted Bulk Job ids`,
      });
    }

    return res.status(200).json({ message: "Jobs Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
