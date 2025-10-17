/*
  Warnings:

  - Made the column `source` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "source" SET NOT NULL,
ALTER COLUMN "source" SET DEFAULT 'Career Page';
