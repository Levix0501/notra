-- CreateEnum
CREATE TYPE "public"."CatalogNodeType" AS ENUM ('STACK');

-- CreateTable
CREATE TABLE "public"."catalog_nodes" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "prev_id" INTEGER,
    "sibling_id" INTEGER,
    "child_id" INTEGER,
    "title" TEXT NOT NULL,
    "type" "public"."CatalogNodeType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "book_id" INTEGER NOT NULL,

    CONSTRAINT "catalog_nodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."catalog_nodes" ADD CONSTRAINT "catalog_nodes_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
