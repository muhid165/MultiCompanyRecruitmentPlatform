import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import { sendApplicationMail } from "../../Services/mail";
import { logActivity } from "../../Utils/activityLog";
import { ActivityLogType, EntityType } from "@prisma/client";

//APPLICATION
export const viewCreateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file)
    throw new Error(
      "Application error: Resume file is missing. Please upload a resume."
    );
  const resumeUrl = `${req.protocol}://${req.get("host")}/files/${
    req.file.filename
  }`;
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

    let skillsArray = skills;
    if (typeof skills === "string") {
      skillsArray = skills.split(",").map((s) => s.trim());
    }
    let experienceData = experience;
    if (typeof experience === "string") {
      try {
        experienceData = JSON.parse(experience);
      } catch {
        console.warn("Invalid experience format");
        experienceData = [];
      }
    }
    const newApplication = await prisma.application.create({
      data: {
        jobId,
        companyId,
        candidateName,
        email,
        phone,
        resumeUrl: resumeUrl,
        experience: experienceData,
        skills: skillsArray,
        currentCTC,
        expectedCTC,
        noticePeriod,
        source,
      },
    });
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });
    const companyName = company?.name || "";
    sendApplicationMail(email, candidateName, companyName);

    return res.status(201).json({
      message: "Application created successfully",
      data: newApplication,
    });
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
    const { companyId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const applications = await prisma.application.findMany({
      where: {
        companyId: companyId as string,
        isDeleted: false,
      },
      include: {
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
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.application.count({
      where: { companyId: companyId as string, isDeleted: false },
    });
    if (total <= 0)
      return res.status(404).json({
        message: "No Applications found",
      });

    return res.status(200).json({
      message: "All Applications of company",
      page,
      tatalPages: Math.ceil(total / limit),
      totalItems: total,
      applications,
    });
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
    const applicationId = req.params.id; // application ID
    const userId = (req as any).user.id;
    const { status } = req.body;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!application) throw new Error("No application found");

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: status,
      },
    });

    const applicationHistory = await prisma.applicationHistory.create({
      data: {
        applicationId: applicationId,
        oldStatus: application.status,
        newStatus: status,
        changeById: userId,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      description: `changed application status to ${status}`,
      changes: { applicationId: applicationId, status: status },
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
    const applicationId = req.params.id;
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
    const applicationId = req.params.id;
    const { note } = req.body;
    const applicatioNote = await prisma.applicationNote.create({
      data: {
        applicationId: applicationId,
        userId,
        note,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.CREATED,
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      description: `application note created`,
      changes: { applicationId: applicationId, note: note },
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
    const userId = (req as any).user.id;
    const noteId = req.params.id;
    const note = await prisma.applicationNote.findUnique({
      where: { id: noteId, isDeleted: false },
    });
    if (!note)
      return res.status(400).json({ message: "No Note found with Id" });
    await prisma.applicationNote.update({
      where: {
        id: noteId,
      },
      data: {
        isDeleted: true,
      },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.DELETED,
      entityType: EntityType.APPLICATION_NOTE,
      entityId: noteId,
      description: `deleted application note`,
      changes: { noteId: noteId, deleted: true },
    });

    return res.status(200).json({ message: "Note Deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const viewApplicationNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationid = req.params.id;
    const notes = await prisma.applicationNote.findMany({
      select: { userId: true, note: true, createdAt: true },
      where: { applicationId: applicationid, isDeleted: false },
    });
    if (!notes)
      return res
        .status(400)
        .json({ message: "No Notes found with applicationId" });

    return res.status(200).json({ data: notes });
  } catch (error) {
    next(error);
  }
};

export const viewSearchApplications = async (
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
      return res
        .status(400)
        .json({ message: "Search query and company ID is required" });
    }

    const applications = await prisma.application.findMany({
      where: {
        OR: [
          { candidateName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        companyId: id,
        isDeleted: false,
      },
      orderBy: { candidateName: "asc" },
    });

    return res.status(200).json({
      applications,
    });
  } catch (error) {
    next(error);
  }
};

export const viewDeleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.id;
    const userId = (req as any).user.userId;

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!application) throw new Error("No Application Found.");

    await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: { isDeleted: true , deletedAt: new Date()},
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.DELETED,
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      description: `Deleted Application`,
    });

    return res
      .status(200)
      .json({ message: "Application  Deleted successfully." });
  } catch (err) {
    next(err);
  }
};

export const viewDeleteBulkApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ids: string[] = req.body.ids;
    const userId = (req as any).user.userId;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided for deletion" });
    }

    await prisma.application.updateMany({
      where: { id: { in: ids } },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    for (const id of ids) {
      await logActivity({
        userId: userId,
        action: ActivityLogType.DELETED,
        entityType: EntityType.APPLICATION,
        entityId: id,
        description: `Deleted Bulk Applications ids`,
      });
    }

    return res
      .status(200)
      .json({ message: "Applications Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
