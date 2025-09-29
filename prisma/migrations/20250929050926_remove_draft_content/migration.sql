/*
  Warnings:

  - You are about to drop the column `draft_content` on the `docs` table. All the data in the column will be lost.
  - You are about to drop the column `is_updated` on the `docs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."docs" DROP COLUMN "draft_content",
DROP COLUMN "is_updated";
