import { ActivityLogType, EntityType } from "@prisma/client";
import prisma from "../Config/prisma";

interface LogActivityProps {
  userId?: string;
  action: ActivityLogType;
  entityType: EntityType;
  entityId?: string;
  description?: string;
  changes?: Record<string, any>;
}

export const logActivity = async ({
  userId,
  action,
  entityType,
  entityId,
  description,
  changes,
}: LogActivityProps): Promise<void> => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        description,
        changes,
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};



