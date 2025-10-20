/*
  Warnings:

  - The `experience` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `skills` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "experience",
ADD COLUMN     "experience" JSONB,
DROP COLUMN "skills",
ADD COLUMN     "skills" JSONB;
