import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";

export const hasPermission = (...perms: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
          UserPermissions: { include: { Permission: true } },
          GroupMember: {
          include: {
            Group: {
              include: {
                Permissions: { include: { Permission: true } },
              },
            },
          },
        },
      },
    });

    const directPerms =
      user?.UserPermissions.map((up) => up.Permission.codename) || [];
    const groupPerms =
      user?.GroupMember.flatMap((gm) =>
        gm.Group.Permissions.map((p) => p.Permission.codename)
      ) || [];

    const allPerms = new Set([...directPerms, ...groupPerms]);

    const hasAtLeastOne = perms.some((p) => allPerms.has(p));
    if (!hasAtLeastOne) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};
