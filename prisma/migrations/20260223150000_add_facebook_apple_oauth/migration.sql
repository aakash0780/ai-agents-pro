-- AlterTable
ALTER TABLE "User" ADD COLUMN "facebookId" TEXT;
ALTER TABLE "User" ADD COLUMN "appleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_facebookId_key" ON "User"("facebookId");
CREATE UNIQUE INDEX "User_appleId_key" ON "User"("appleId");
