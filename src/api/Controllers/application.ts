import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import { sendApplicationMail } from "../../Services/mail";
import { logActivity } from "../../Utils/activityLog";
import { ActivityLogType, Application, EntityType } from "@prisma/client";
import { filterData } from "../../Utils/filterData";
import { normalizeQuery } from "../../Utils/normalizeQuery";
import { buildPrismaFilters } from "../../Utils/buildPrismaFilters";

//APPLICATION   // updated this controller to get companyID from the token
export const viewCreateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const companyId = req.query.companyId;

  if (!companyId || typeof companyId !== "string") {
    return res.status(400).json({ message: "Missing or invalid companyId." });
  }

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
      } catch (err) {
        throw new Error("Invalid format for experience. Must be valid JSON.");
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
    await sendApplicationMail(email, candidateName, companyName);

    return res.status(201).json({
      message: "Application created successfully",
      data: newApplication,
    });
  } catch (error) {
    console.log("Error", error);
    next(error);
  }
};

// export const viewCompanyApplications = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { companyId } = req.query;
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;

//     if (!companyId || typeof companyId !== "string") {
//       return res.status(400).json({ message: "Missing or invalid companyId." });
//     }

//     const [applications, total] = await Promise.all([
//       prisma.application.findMany({
//         where: {
//           companyId,
//           isDeleted: false,
//         },
//         include: {
//           Notes: {
//             select: {
//               userId: true,
//               note: true,
//             },
//           },
//           History: {
//             select: {
//               oldStatus: true,
//               newStatus: true,
//               changeById: true,
//             },
//           },
//         },
//         orderBy: { createdAt: "desc" },
//         skip,
//         take: limit,
//       }),
//       prisma.application.count({
//         where: { companyId, isDeleted: false },
//       }),
//     ]);
//     if (total === 0)
//       return res.status(404).json({
//         message: "No Applications found for this company",
//       });

//     return res.status(200).json({
//       message: " Applications fetched successfully",
//       page,
//       totalPages: Math.ceil(total / limit),
//       totalItems: total,
//       applications,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const viewCompanyApplications = async (
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
      status: {
        type: "enum" as const,
        enumValues: [
          "APPLIED",
          "SHORTLISTED",
          "INTERVIEW",
          "OFFERED",
          "HIRED",
          "REJECTED",
        ],
      },
    };

    const normalized = normalizeQuery(req.query);

    if (!normalized.companyId || typeof normalized.companyId !== "string") {
      return res.status(400).json({ message: "Missing or invalid companyId." });
    }

    const filters: any = buildPrismaFilters(normalized, schemaFields);

    filters.isDeleted = false;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: filters,
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
      }),
      prisma.application.count({ where: filters }),
    ]);

    if (total === 0)
      return res.status(404).json({
        message: "No Applications found for this company",
      });

    return res.status(200).json({
      message: "Applications fetched successfully",
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

export const viewUpdateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("this is the body : ", req.body);
    const userId = (req as any).user?.id;
    const applicationId = req.params.id;
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
      status,
      source,
      resumeUrl: bodyResumeUrl, // Optional existing resume URL from frontend
    } = req.body;

    const existingApplication = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!existingApplication) {
      return res.status(404).json({ message: "Application not found." });
    }

    let resumeUrl = existingApplication.resumeUrl;

    if (req.file) {
      resumeUrl = `${req.protocol}://${req.get("host")}/files/${
        req.file.filename
      }`;
    } else if (bodyResumeUrl && bodyResumeUrl.trim() !== "") {
      resumeUrl = bodyResumeUrl.trim();
    }

    let skillsArray = skills;
    if (typeof skills === "string") {
      skillsArray = skills.split(",").map((s) => s.trim());
    }

    let experienceData = experience;
    if (typeof experience === "string") {
      try {
        experienceData = JSON.parse(experience);
      } catch (err) {
        throw new Error("Invalid format for experience. Must be valid JSON.");
      }
    }

    // ✅ Update directly since frontend sends all fields
    // const updatedApplication = await prisma.application.update({
    //   where: { id: applicationId },
    //   data: {
    //     jobId,
    //     companyId,
    //     candidateName,
    //     email,
    //     phone,
    //     resumeUrl,
    //     experience: experienceData,
    //     skills: skillsArray,
    //     currentCTC,
    //     expectedCTC,
    //     noticePeriod,
    //     status,
    //     source,
    //   },
    // });

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        jobId,
        companyId,
        candidateName,
        email,
        phone,
        resumeUrl,
        experience: experienceData,
        skills: skillsArray,
        currentCTC,
        expectedCTC,
        noticePeriod,
        status,
        source,
      },
    });

    if (status && status !== existingApplication.status) {
      await prisma.applicationHistory.create({
        data: {
          applicationId,
          oldStatus: existingApplication.status,
          newStatus: status,
          changeById: userId,
        },
      });
    }

    // ✅ Log update
    await logActivity({
      userId,
      action: ActivityLogType.UPDATED,
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      description: `Updated application for candidate "${updatedApplication.candidateName}".`,
      changes: { applicationId },
    });

    return res.status(200).json({
      message: "Application updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application:", error);
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
    if (!applicationId || typeof applicationId !== "string") {
      return res
        .status(400)
        .json({ message: "Invalid or missing application ID." });
    }
    const history = await prisma.applicationHistory.findMany({
      where: {
        applicationId,
      },
      orderBy: { changedAt: "asc" },
    });

    if (!history || history.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for this application." });
    }
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
    const userId = (req as any).user?.id;
    const applicationId = req.params.id;
    const { note } = req.body;

    const applicatioNote = await prisma.applicationNote.create({
      data: {
        applicationId,
        userId,
        note,
      },
      include: { User: true },
    });

    await logActivity({
      userId: userId,
      action: ActivityLogType.CREATED,
      entityType: EntityType.APPLICATION_NOTE,
      entityId: applicationId,
      description: `application note created`,
      changes: { applicationId: applicationId, note: note },
    });
    return res
      .status(200)
      .json({ message: "Note created successfully", data: applicatioNote });
  } catch (error) {
    next(error);
  }
};

export const viewUpdateApplicationNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const noteId = req.params.id;
    const { note } = req.body;

    console.log("this is the note ID", req.params);
    console.log("this is the note", req.body);

    const updatednote = await prisma.applicationNote.update({
      where: {
        id: noteId,
      },
      data: {
        note: note,
      },
      select: { note: true, createdAt: true, updatedAt: true, User: true },
    });

    return res
      .status(200)
      .json({ message: "Note updated successfully", data: updatednote });
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
    const userId = (req as any).user?.id;
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
        deletedAt: new Date(),
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
    const applicationId = req.params.id;

    const notes = await prisma.applicationNote.findMany({
      select: {
        id: true,
        note: true,
        createdAt: true,
        updatedAt: true,
        User: true,
      },
      where: { applicationId, isDeleted: false },
      orderBy: { createdAt: "desc" },
    });

    if (notes.length === 0) {
      return res
        .status(404)
        .json({ message: "No notes found for this application." });
    }

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
    const userId = (req as any).user?.id;

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!application) throw new Error("Application not found.");
    if (application.isDeleted) {
      return res.status(400).json({ message: "Application already deleted." });
    }
    await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: { isDeleted: true, deletedAt: new Date() },
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
    const userId = (req as any).user?.id;

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

export const viewApplicationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.id;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        Notes: true,
        History: true,
      },
    });

    if (!application)
      return res.status(400).json({ message: "no Application Found " });

    return res.status(200).json({
      message: " Applications fetched successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};
