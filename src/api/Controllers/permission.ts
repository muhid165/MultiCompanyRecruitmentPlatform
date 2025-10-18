import { Request, Response, NextFunction } from "express";
import prisma from "../../Config/prisma";

export const viewLoggedUserPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;

    // Fetch user-specific and group-based permissions
    const [userPermissions, groupMemberships] = await Promise.all([
      prisma.userPermission.findMany({
        where: { userId },
        include: { Permission: true },
      }),
      prisma.groupMember.findMany({
        where: { userId },
        include: {
          Group: {
            include: {
              Permissions: {
                include: { Permission: true },
              },
            },
          },
        },
      }),
    ]);

    // Flatten group permissions
    const groupPermissions = groupMemberships.flatMap((gm) =>
      gm.Group.Permissions.map((gp) => gp.Permission)
    );

    // Combine user and group permissions
    const combinedPermissions = [
      ...userPermissions.map((up) => up.Permission),
      ...groupPermissions,
    ];

    // Deduplicate by codename
    const uniquePermissionsMap = new Map<
      string,
      (typeof combinedPermissions)[number]
    >();
    for (const perm of combinedPermissions) {
      if (!uniquePermissionsMap.has(perm.codename)) {
        uniquePermissionsMap.set(perm.codename, perm);
      }
    }
    
    const uniquePermissions = Array.from(uniquePermissionsMap.values());

    res.status(200).json({
      message: "Permissions Retrieved",
      permissions: uniquePermissions,
    });
  } catch (error) {
    next(error);
  }
};
export const viewPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await prisma.permission.findMany({});

    res.status(200).json(permissions);
  } catch (error) {
    next(error);
  }
};

export const viewUserPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const userPermissions = await prisma.userPermission.findMany({
      where: { userId: userId },
      include: { Permission: true },
    });

    const permissions = userPermissions.map((up) => up.Permission);

    res.status(200).json(permissions);
  } catch (error) {
    next(error);
  }
};
export const viewAssignUserPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { permissionIds } = req.body;

    if (!Array.isArray(permissionIds)) {
      return res
        .status(400)
        .json({ message: "permissionIds must be an array" });
    }
    await prisma.userPermission.deleteMany({
      where: { userId: userId },
    });

    const data = permissionIds.map((pid: any) => ({
      userId: userId,
      permissionId: pid,
    }));
    await prisma.userPermission.createMany({ data });

    res.status(200).json({ message: "User permissions updated successfully" });
  } catch (error) {
    next(error);
  }
};
export const viewDeleteUserPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { permissionIds } = req.body;
  
    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      return res.status(400).json({ message: "permissionIds must be a non-empty array" });
    }
    await prisma.userPermission.deleteMany({
      where: {
        userId: userId,
        permissionId: { in: permissionIds },
      },
    });

    res.status(200).json({ message: "User permissions deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const viewCreateGroupWithPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, permissionIds } = req.body;
    const userId = (req as any).user?.id;
    if (!name || !Array.isArray(permissionIds) || permissionIds.length === 0) {
      return res.status(400).json({
        message: "Group name and at least one Permission are required",
      });
    }

    const validPermissions = await prisma.permission.findMany({
      where: {
        id: { in: permissionIds },
      },
      select: { id: true },
    });

    if (validPermissions.length === 0) {
      return res.status(400).json({
        message: "Provided Permissions are invalid or not found",
      });
    }

    const group = await prisma.group.create({
      data: { name },
    });

    const data = validPermissions.map(({ id }) => ({
      groupId: group.id,
      permissionId: id,
    }));

    await prisma.groupPermission.createMany({
      data,
      skipDuplicates: true,
    });

    res.status(201).json({
      message: "Group created and permissions assigned successfully",
      group,
    });
  } catch (error) {
    next(error);
  }
};
export const viewGroups = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const groups = await prisma.group.findMany({});

    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};
export const viewGroupPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const permissions = await prisma.groupPermission.findMany({
      where: { groupId: id},

      include: { Group: true, Permission: true },
    });

    res.status(200).json(permissions);
  } catch (error) {
    next(error);
  }
};
export const viewUpdateGroupPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;
    const userId = (req as any).user?.userId;
    await prisma.groupPermission.deleteMany({ where: { groupId: id } });

    const data = permissionIds.map((pid: any) => ({
      groupId: Number(id),
      permissionId: pid,
    }));
    await prisma.groupPermission.createMany({ data });

    res.status(200).json({ message: "Group permissions updated successfully" });
  } catch (error) {
    next(error);
  }
};
export const viewDeleteGroupPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;
    const userId = (req as any).user?.id;

    const existingGroup = await prisma.group.findUnique({
      where: { id: id },
    });

    if (!existingGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    await prisma.groupPermission.deleteMany({
      where: {
        groupId: id,
        permissionId: { in: permissionIds },
      },
    });
    res.status(200).json({ message: "Group permissions deleted successfully" });
  } catch (error) {
    next(error);
  }
};
export const viewDeleteGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // const { permissionIds } = req.body;
    const userId = (req as any).user?.id;
    const existingGroup = await prisma.group.findUnique({
      where: { id: id},
    });

    if (!existingGroup) {
      return res.status(404).json({ message: "Group not found" });
    }
    await prisma.group.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    next(error);
  }
};
export const viewUserGroups = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;

    const groups = await prisma.groupMember.findMany({
      where: { userId: userId },
      include: { Group: true },
    });

    res.status(200).json(groups.map((g) => g.Group));
  } catch (error) {
    next(error);
  }
};
// ✅ Update groups for a user (replace all)
export const viewAssignGroupsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const { groupIds } = req.body;
    console.log(groupIds);

    if (!Array.isArray(groupIds)) {
      return res.status(400).json({ message: "groupIds must be an array" });
    }

    await prisma.groupMember.deleteMany({ where: { userId: userId } });

    const data = groupIds.map((groupId: string) => ({
      userId: userId,
      groupId: JSON.stringify(groupId),
    }));
    console.log("this is the data :- ",data)
    await prisma.groupMember.createMany({ data });

    res.status(200).json({ message: "User groups updated" });
  } catch (error) {
    next(error);
  }
};
export const viewDeleteUserGroups = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const { groupIds } = req.body;

    if (!Array.isArray(groupIds)) {
      return res.status(400).json({ message: "groupIds must be an array" });
    }

    await prisma.groupMember.deleteMany({
      where: {
        userId: userId,
        groupId: { in: groupIds },
      },
    });

    res.status(200).json({ message: "Selected groups removed from user" });
  } catch (error) {
    next(error);
  }
};
