import { Request, Response, NextFunction } from "express";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import prisma from "../../Config/prisma";
// import addSheetWithStyles from "../../utils/stylesheet";
import { UserType } from "@prisma/client";
import { normalizeQuery } from "../../Utils/normalizeQuery";
import { buildPrismaFilters } from "../../Utils/buildPrismaFilters";
// import { auditLog } from "../../utils/audit";   // create own log

/**
 * Create Role
 */
export const viewCreateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId;
    const { code, name, roleType, description, companyId } = req.body;

    const role = await prisma.role.create({
      data: {
        code,
        name,
        roleType: roleType as UserType | null,
        description: description ?? null,
        companyId: companyId ?? null,
      },
    });

    // await auditLog(userId, role.id, AuditLogType.CREATE, EntityType.ROLE, null);

    return res.status(201).json({ message: "Role Created", role });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Role
 */
export const viewUpdateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = req.params.id;
    const userId = (req as any).user.userId;
    const { code, name, roleType, description, companyId } = req.body;

    const updated = await prisma.role.update({
      where: { id: roleId },
      data: {
        ...(code !== undefined ? { code } : {}),
        ...(name !== undefined ? { name } : {}),
        ...(roleType !== undefined
          ? { roleType: roleType as UserType | null }
          : {}),
        ...(description !== undefined ? { description } : {}),
        ...(companyId !== undefined ? { companyId } : {}),
      },
    });

    // await auditLog(
    //   userId,
    //   updated.id,
    //   AuditLogType.UPDATE,
    //   EntityType.ROLE,
    //   null
    // );

    return res.status(200).json({ message: "Role Updated", role: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Get All Roles with pagination + filters
 */
export const viewRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageNumber = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // map query fields to Prisma paths (when nested)
    const schemaFields = {
      companyId: { type: "string" as const },
      roleType: {
        type: "enum" as const,
        enumValues: ["SYSTEM", "CLIENT", "STAFF", "ADMIN"],
      },
      code: { type: "string" as const, path: ["code"] },
      name: { type: "string" as const, path: ["name"] },
    };

    const normalized = normalizeQuery(req.query);
    const filters: any = buildPrismaFilters(normalized, schemaFields);

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where: filters,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip,
        take: pageSize,
      }),
      prisma.role.count({
        where: filters,
      }),
    ]);

    return res.status(200).json({
      roles,
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Search Roles (free-text): code/name exact/contains, roleType enum match
 */
export const viewSearchRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = (req.query.companyId as string) || "";
    const q = (req.query.query as string) || "";
    const pageNumber = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const enumFilters: any[] = [];
    const up = q.toUpperCase();
    if (Object.values(UserType).includes(up as UserType)) {
      enumFilters.push({ roleType: up as UserType });
    }

    const where: any = {
      // isDeleted: false,
      ...(q &&
        companyId && {
          OR: [
            { code: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            ...enumFilters,
          ],
        }),
    };

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.role.count({ where }),
    ]);

    return res.status(200).json({
      roles,
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Role by ID
 */
export const viewRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await prisma.role.findFirst({
      where: { id: req.params.id },
      select: {
        id: true,
        code: true,
        name: true,
        roleType: true,
        description: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!role) return res.status(404).json({ message: "Role not found" });

    return res.status(200).json({ role });
  } catch (err) {
    next(err);
  }
};

/**
 * !Soft Delete Role
 */
export const viewDeleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = req.params.id;
    const userId = (req as any).user.userId;

    const role = await prisma.role.delete({
      where: { id: roleId },
    });

    // await auditLog(userId, role.id, AuditLogType.DELETE, EntityType.ROLE, null);

    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * !Soft Delete Roles (Bulk)
 */
export const viewDeleteBulkRoles = async (
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

    await prisma.role.deleteMany({
      where: { id: { in: ids } },
    });

    for (const id of ids) {
      //   await auditLog(userId, id, AuditLogType.DELETE, EntityType.ROLE, null);
    }

    return res.status(200).json({ message: "Roles Deleted" });
  } catch (err) {
    next(err);
  }
};

/**
 * Import Roles (Excel/CSV)
 * Expected headers: code, name, roleType, description, companyId
 */
export const viewBulkCreateRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "File not provided" });

    const userId = (req as any).user.userId;

    // Basic CSV/Excel parse via ExcelJS (accepts .xlsx recommended)
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(req.file.path);
    const ws = wb.worksheets[0];

    const headers: string[] = [];
    ws.getRow(1).eachCell((cell) => headers.push(String(cell.value).trim()));

    const rowsCreated: any[] = [];
    const invalidRows: any[] = [];

    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const record: any = {};
      headers.forEach((h, idx) => {
        record[h] = row.getCell(idx + 1).value ?? null;
      });

      try {
        const created = await prisma.role.create({
          data: {
            code: String(record.code),
            name: String(record.name),
            roleType: record.roleType
              ? (String(record.roleType).toUpperCase() as UserType)
              : null,
            description: record.description ? String(record.description) : null,
            companyId: record.companyId ? String(record.companyId) : null,
          },
          select: { id: true, code: true, name: true },
        });

        // await auditLog(
        //   userId,
        //   created.id,
        //   AuditLogType.CREATE,
        //   EntityType.ROLE,
        //   null
        // );
        rowsCreated.push(created);
      } catch (e: any) {
        invalidRows.push({ row: r, error: e?.message || "Invalid data" });
      }
    }

    fs.unlinkSync(req.file.path); // cleanup

    return res.status(200).json({
      message: `${rowsCreated.length} Roles Imported`,
      invalid: invalidRows,
      roles: rowsCreated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Export Roles to Excel
 */
export const viewBulkExportRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        roleType: true,
        description: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const rows = roles.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      roleType: r.roleType ?? "-",
      description: r.description ?? "-",
      companyId: r.companyId ?? "-",
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    const headers = [
      "ID",
      "Code",
      "Name",
      "Role Type",
      "Description",
      "Client ID",
      "Created At",
      "Updated At",
    ];

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "RK Foodland Pvt. Ltd.";
    workbook.created = new Date();

    // addSheetWithStyles(workbook, "Roles", rows, headers);

    const filePath = path.join(__dirname, "RolesExport.xlsx");
    await workbook.xlsx.writeFile(filePath);

    return res.download(filePath, "RolesExport.xlsx", (err) => {
      try {
        fs.unlinkSync(filePath);
      } catch {}
      if (err) {
        return res
          .status(500)
          .json({ message: "Error downloading file", error: err.message });
      }
    });
  } catch (err) {
    next(err);
  }
};
