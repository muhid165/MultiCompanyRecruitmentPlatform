/*
  Warnings:

  - A unique constraint covering the columns `[companyId,userId]` on the table `TenantAssingment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TenantAssingment_companyId_userId_key" ON "TenantAssingment"("companyId", "userId");
