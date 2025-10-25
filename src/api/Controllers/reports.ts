import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

// working fine
export const exportCompanyReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;
    const { from, to } = req.query;

    const fromDate = from ? new Date(from as string) : new Date("1970-01-01");
    const toDate = to ? new Date(to as string) : new Date();

    // ✅ Fetch departments
    const departments = await prisma.department.findMany({
      where: { companyId, isDeleted: false },
      include: {
        job: {
          where: { isDeleted: false },
          include: {
            Application: {
              where: {
                isDeleted: false,
                createdAt: { gte: fromDate, lte: toDate },
              },
            },
          },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Company Report");

    worksheet.columns = [
      { header: "Department Name", key: "department", width: 30 },
      { header: "Job Title", key: "title", width: 30 },
      { header: "Job Description", key: "description", width: 50 },
      { header: "Resume URL", key: "resume", width: 50 },
    ];

    // ✅ Handle no data case
    if (!departments || departments.length === 0) {
      worksheet.addRow({
        department: "-",
        title: "-",
        description: "-",
        resume: "No data available for this company.",
      });
    } else {
      // ✅ Add rows for each department, job, and application
      for (const dept of departments) {
        if (!dept.job || dept.job.length === 0) {
          worksheet.addRow({
            department: dept.name,
            title: "-",
            description: "-",
            resume: "-",
          });
          continue;
        }

        for (const job of dept.job) {
          if (!job.Application || job.Application.length === 0) {
            worksheet.addRow({
              department: dept.name,
              title: job.title,
              description: job.description,
              resume: "-",
            });
            continue;
          }

          for (const application of job.Application) {
            const fileName = path.basename(application.resumeUrl || "");
            const resumeFullUrl = application.resumeUrl
              ? `${req.protocol}://${req.get("host")}/files/${fileName}`
              : "-";

            worksheet.addRow({
              department: dept.name,
              title: job.title,
              description: job.description,
              resume: application.resumeUrl
                ? { text: "Download Resume", hyperlink: resumeFullUrl }
                : "-",
            });
          }
        }
      }
    }

    // ✅ Move response sending *outside* the loop
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=company_${companyId}_report.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Error:", error);
    next(error);
  }
};

export const exportGlobalReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { from, to } = req.query;

    const fromDate = from ? new Date(from as string) : new Date("1970-01-01");
    const toDate = to ? new Date(to as string) : new Date();

    const companies = await prisma.company.findMany({
      where: { isDeleted: false },
      include: {
        Department: {
          where: { isDeleted: false },
          include: {
            job: {
              where: { isDeleted: false },
              include: {
                Application: {
                  where: {
                    isDeleted: false,
                    createdAt: { gte: fromDate, lte: toDate },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Build public URL for resume
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const workbook = new ExcelJS.Workbook();

    for (const company of companies) {
      const worksheet = workbook.addWorksheet(company.name.slice(0, 31));

      worksheet.columns = [
        { header: "Department Name", key: "department", width: 30 },
        { header: "Job Title", key: "title", width: 30 },
        { header: "Job Description", key: "description", width: 50 },
        { header: "Resume URL", key: "resume", width: 50 },
      ];

      for (const dept of company.Department) {
        if (!dept.job || dept.job.length === 0) {
          worksheet.addRow({
            department: dept.name,
            title: "-",
            description: "-",
            resume: "-",
          });
        } else {
          for (const job of dept.job) {
            if (!job.Application || job.Application.length === 0) {
              worksheet.addRow({
                department: dept.name,
                title: job.title,
                description: job.description,
                resume: "-",
              });
            } else {
              for (const application of job.Application) {
                if (application.resumeUrl) {
                  const fileName = path.basename(application.resumeUrl);
                  const resumeFullUrl = `${req.protocol}://${req.get(
                    "host"
                  )}/files/${fileName}`;

                  worksheet.addRow({
                    department: dept.name,
                    title: job.title,
                    description: job.description,
                    resume: {
                      text: "Download Resume",
                      hyperlink: resumeFullUrl,
                    },
                  });
                }
              }
            }
          }
        }
      }
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=all_companies_report.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export All Companies Error:", error);
    next(error);
  }
};
