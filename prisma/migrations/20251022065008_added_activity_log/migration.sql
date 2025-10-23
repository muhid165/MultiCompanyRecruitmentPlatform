-- CreateEnum
CREATE TYPE "ActivityLogType" AS ENUM ('CREATED', 'UPDATED', 'DELETED', 'ASSIGNED', 'REVOKED');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('USER', 'ROLE', 'PERMISSION', 'COMPANY', 'DEPARTMENT', 'JOB');

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "ActivityLogType" NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT,
    "description" TEXT,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);
