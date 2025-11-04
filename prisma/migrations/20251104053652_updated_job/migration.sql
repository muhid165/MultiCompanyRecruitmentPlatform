/*
  Warnings:

  - You are about to drop the column `requirements` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `responsibilities` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "requirements",
DROP COLUMN "responsibilities",
DROP COLUMN "title";
