/*
  Warnings:

  - A unique constraint covering the columns `[doc_id]` on the table `catalog_nodes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "public"."CatalogNodeType" ADD VALUE 'DOC';

-- AlterTable
ALTER TABLE "public"."catalog_nodes" ADD COLUMN     "doc_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."docs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "book_id" INTEGER NOT NULL,

    CONSTRAINT "docs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "docs_slug_key" ON "public"."docs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_nodes_doc_id_key" ON "public"."catalog_nodes"("doc_id");

-- AddForeignKey
ALTER TABLE "public"."catalog_nodes" ADD CONSTRAINT "catalog_nodes_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."docs" ADD CONSTRAINT "docs_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
