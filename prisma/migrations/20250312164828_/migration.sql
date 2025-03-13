/*
  Warnings:

  - You are about to drop the column `version` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "version",
ADD COLUMN     "versionToken" INTEGER NOT NULL DEFAULT 1;
