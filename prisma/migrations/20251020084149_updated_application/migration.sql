-- DropForeignKey
ALTER TABLE "public"."ApplicationHistory" DROP CONSTRAINT "ApplicationHistory_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApplicationNote" DROP CONSTRAINT "ApplicationNote_applicationId_fkey";

-- AddForeignKey
ALTER TABLE "ApplicationNote" ADD CONSTRAINT "ApplicationNote_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationHistory" ADD CONSTRAINT "ApplicationHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
