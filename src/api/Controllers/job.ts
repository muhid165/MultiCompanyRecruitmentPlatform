import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";

export const viewCreateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { companyId } = req.params;
    const {
      departmentId,
      title,
      location,
      experience,
      salaryRange,
      employmentType,
      description,
      responsibilities,
      requirements,
    } = req.body;

    const job = await prisma.job.create({
      data: {
        companyId: companyId,
        departmentId: departmentId,
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
    const { jobId } = req.params;
    const {
      departmentId,
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
        departmentId,
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
    const { companyId } = req.params; // companyId
    console.log("this is the received data ",companyId)
    const jobs = await prisma.job.findMany({
      select: {
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
        companyId: companyId,
      },
    });

    return res.status(200).json({ jobs });
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
    const { jobId } = req.params; // jobId
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
        isDeleted: false
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
    const { jobId } = req.params; // jobId
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });
    if (!job) return res.status(400).json({ message: "No Job foound" });

    const publishedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        published: true,
      },
    });
    return res
      .status(200)
      .json({ message: "Job published successfully", publishedJob });
  } catch (error) {
    next(error);
  }
};
