/*
  Warnings:

  - The `experience` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "experience",
ADD COLUMN     "experience" TEXT[];
