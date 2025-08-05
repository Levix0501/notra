/*
  Warnings:

  - You are about to drop the column `darkLogo` on the `site_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."site_settings" DROP COLUMN "darkLogo",
ADD COLUMN     "dark_logo" TEXT;
