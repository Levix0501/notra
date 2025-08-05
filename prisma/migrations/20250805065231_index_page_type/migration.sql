-- CreateEnum
CREATE TYPE "public"."IndexPageType" AS ENUM ('DOC', 'CARD');

-- AlterTable
ALTER TABLE "public"."site_settings" ADD COLUMN     "index_description" TEXT,
ADD COLUMN     "index_page_type" "public"."IndexPageType" NOT NULL DEFAULT 'CARD',
ADD COLUMN     "index_title" TEXT,
ADD COLUMN     "is_main_new_tab" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_sub_new_tab" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "main_action_text" TEXT,
ADD COLUMN     "main_action_url" TEXT,
ADD COLUMN     "sub_action_text" TEXT,
ADD COLUMN     "sub_action_url" TEXT;
