import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import { filterData } from "./filter";
import { ActivityLogType, EntityType, Job } from "@prisma/client";
import { logActivity } from "../../Utils/activityLog";

export const viewCreateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { companyId } = req.query;
    const {
      department,
      title,
      location,
      experience,
      salaryRange,
      employmentType,
      description,
      responsibilities,
      requirements,
    } = req.body;

    const existingDepartment = await prisma.department.findFirst({
      where: {
        companyId: companyId as string,
        name: department,
      },
    });
    if (!existingDepartment) throw new Error("No Department in company");
    const job = await prisma.job.create({
      data: {
        companyId: companyId as string,
        departmentId: existingDepartment.id,
        title,
        location,
        experience,
        salaryRange,
        employmentType,
        description,
        responsibilities,
        requirements,
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
    const userId = (req as any).user.id;
    const { jobId } = req.params;
    const {
      title,
      location,
      experience,
      salaryRange,
      employmentType,
      description,
      responsibilities,
      requirements,
    } = req.body;

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });
    if (!job) return res.status(400).json({ message: "Job not found " });

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        location,
        experience,
        salaryRange,
        employmentType,
        description,
        responsibilities,
        requirements,
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
    const { companyId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        companyId: true,
        Department: { select: { id: true, name: true } },
        title: true,
        location: true,
        experience: true,
        salaryRange: true,
        employmentType: true,
        description: true,
        responsibilities: true,
        requirements: true,
        CreatedBy: { select: { id: true } },
        published: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        companyId: companyId as string,
        isDeleted: false,
      },
      skip,
      take: limit,
    });

    const total = await prisma.job.count({
      where: { companyId: companyId as string, isDeleted: false },
    });
    if (total <= 0)
      return res.status(404).json({
        message: "No Job found",
      });

    return res.status(200).json({
      page,
      tatalPages: Math.ceil(total / limit),
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
        title: true,
        location: true,
        experience: true,
        salaryRange: true,
        employmentType: true,
        description: true,
        responsibilities: true,
        requirements: true,
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
      where: { companyId: companyId as string, isDeleted: false },
    });
    if (total <= 0)
      return res.status(404).json({
        message: "No Job found",
      });

    return res.status(200).json({
      page,
      tatalPages: Math.ceil(total / limit),
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
    const userId = (req as any).user.id;
    const { jobId } = req.params; // jobId
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
        status: "CLOSED",
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
export const viewPublishJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { jobId } = req.params; // jobId
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });
    if (!job) return res.status(400).json({ message: "No Job foound" });

    const publishedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        published: true,
        status: "ACTIVE",
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.JOB,
      description: `Published a job`,
      changes: { jobId: job.id },
    });

    return res
      .status(200)
      .json({ message: "Job published successfully", publishedJob });
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
    const { companyId, title } = req.query as {
      companyId?: string;
      title?: string;
    };

    // Step 1: Reuse your generic filterData utility
    const result = (await filterData({
      model: prisma.job,
      query: req.query,
    })) as { success: boolean; data: Job[] };

    // Step 2: Prepare custom response
    let responseData: Partial<Job>[] = [];

    if (companyId && !title) {
      // Only companyId present → return all job titles for that company
      responseData = result.data.map((job) => ({
        title: job.title,
      }));
    } else if (companyId && title) {
      // Both companyId & title present → return id + title of matched job(s)
      responseData = result.data.map((job) => ({
        id: job.id,
        title: job.title,
      }));
    } else {
      // Default: return everything (fallback)
      responseData = result.data;
    }

    return res.status(200).json({
      message: "Filtered job data fetched successfully",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
