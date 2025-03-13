/*
  Warnings:

  - You are about to drop the column `clientId` on the `ApiClient` table. All the data in the column will be lost.
  - You are about to drop the column `clientSecret` on the `ApiClient` table. All the data in the column will be lost.
  - You are about to drop the column `tokenVersion` on the `ApiClient` table. All the data in the column will be lost.
  - Added the required column `secret` to the `ApiClient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ApiClient_clientId_key";

-- AlterTable
ALTER TABLE "ApiClient" DROP COLUMN "clientId",
DROP COLUMN "clientSecret",
DROP COLUMN "tokenVersion",
ADD COLUMN     "secret" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0;
