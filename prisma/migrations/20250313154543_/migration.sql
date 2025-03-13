/*
  Warnings:

  - You are about to drop the column `secret` on the `ApiClient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApiClient" DROP COLUMN "secret";
