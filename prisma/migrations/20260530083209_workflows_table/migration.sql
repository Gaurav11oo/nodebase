-- AlterTable
ALTER TABLE "User" ALTER COLUMN "emailVerified" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);
