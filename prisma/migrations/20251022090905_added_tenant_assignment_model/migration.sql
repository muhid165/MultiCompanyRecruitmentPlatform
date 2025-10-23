-- CreateTable
CREATE TABLE "TenantAssingment" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantAssingment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TenantAssingment" ADD CONSTRAINT "TenantAssingment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantAssingment" ADD CONSTRAINT "TenantAssingment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
