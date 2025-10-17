import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";

//APPLICATION
export const viewCreateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return res.status(400).json({ message: "No Resume Found.." });
  const filePath = `./public/temp/${req.file.filename}`;

  try {
    const {
      jobId,
      companyId,
      candidateName,
      email,
      phone,
      experience,
      skills,
      currentCTC,
      expectedCTC,
      noticePeriod,
      source,
    } = req.body;

    const newApplication = await prisma.application.create({
      data: {
        jobId: jobId,
        companyId: companyId,
        candidateName,
        email,
        phone,
        resumeUrl: filePath,
        experience,
        skills,
        currentCTC,
        expectedCTC,
        noticePeriod,
        source,
      },
    });

    return res
      .status(201)
      .json({ message: "Application created successfully" });
  } catch (error) {
    next(error);
  }
};
export const viewCompanyApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;

    const applications = await prisma.application.findMany({
      select: {
        id: true,
        jobId: true,
        companyId: true,
        candidateName: true,
        email: true,
        phone: true,
        resumeUrl: true,
        experience: true,
        skills: true,
        currentCTC: true,
        expectedCTC: true,
        noticePeriod: true,
        status: true,
        source: true,
        createdAt: true,
        updatedAt: true,
        Notes: {
          select: {
            userId: true,
            note: true,
          },
        },
        History: {
          select: {
            oldStatus: true,
            newStatus: true,
            changeById: true,
          },
        },
      },
      where: {
        companyId: companyId,
        isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
    });

    return res
      .status(200)
      .json({ message: "All Applications of company", applications });
  } catch (error) {
    next(error);
  }
};
export const viewChangeApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { applicationId } = req.params; // application ID
    const userId = (req as any).user.id;
    const { status } = req.body;
    const validStatuses = [
      "APPLIED",
      "SHORTLISTED",
      "INTERVIEW",
      "OFFERED",
      "HIRED",
      "REJECTED",
    ];
    if (!validStatuses.includes(status))
      throw new Error("Invalid Application status provided.");

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!application) throw new Error("No application found");

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId},
      data: {
        status: status,
      },
    });

    const applHistory = await prisma.applicationHistory.create({
      data: {
        applicationId: applicationId,
        oldStatus: application.status,
        newStatus: status,
        changeById: userId,
      },
    });

    return res
      .status(200)
      .json({ message: "Application status changed successfully " });
  } catch (error) {
    next(error);
  }
};
//APPLICATION HISTORY
export const viewApplicationHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { applicationId } = req.params;
    const history = await prisma.applicationHistory.findMany({
      where: {
        applicationId: applicationId,
      },
      orderBy: { id: "asc" },
    });
    return res.status(200).json({ history });
  } catch (error) {
    next(error);
  }
};
//APPLICATION NOTE
export const viewCreateApplicationNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const { applicationId } = req.params;
    const { note } = req.body;
    const applicatioNote = await prisma.applicationNote.create({
      data: {
        applicationId: applicationId,
        userId,
        note,
      },
    });
    return res.status(200).json({ message: "Note created ", applicatioNote });
  } catch (error) {
    next(error);
  }
};
export const deleteApplicationNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { noteId } = req.params;

    await prisma.applicationNote.update({
      where: {
        id: noteId,
      },
      data: {
        isDeleted: true,
      },
    });
    return res.status(200).json({ message: "Note Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
