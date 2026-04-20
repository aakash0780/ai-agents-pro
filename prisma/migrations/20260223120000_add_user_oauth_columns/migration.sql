-- AlterTable: add OAuth and avatar columns to User (idempotent)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "githubId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatar" TEXT;

-- CreateIndex (idempotent)
CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_githubId_key" ON "User"("githubId");

-- Make password nullable if it was NOT NULL (for OAuth-only users)
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
