/*
  Warnings:

  - You are about to drop the column `home_page` on the `site_settings` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."RedirectType" AS ENUM ('BOOK', 'DOC', 'PAGE', 'NONE');

-- AlterTable
ALTER TABLE "public"."site_settings" DROP COLUMN "home_page",
ADD COLUMN     "home_page_redirect_type" "public"."RedirectType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "redirect_to_book_id" INTEGER,
ADD COLUMN     "redirect_to_doc_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."site_settings" ADD CONSTRAINT "site_settings_redirect_to_book_id_fkey" FOREIGN KEY ("redirect_to_book_id") REFERENCES "public"."books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."site_settings" ADD CONSTRAINT "site_settings_redirect_to_doc_id_fkey" FOREIGN KEY ("redirect_to_doc_id") REFERENCES "public"."docs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
