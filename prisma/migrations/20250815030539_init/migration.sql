-- CreateEnum
CREATE TYPE "public"."IndexPageType" AS ENUM ('DOC', 'CARD');

-- CreateEnum
CREATE TYPE "public"."CatalogNodeType" AS ENUM ('STACK', 'DOC');

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."site_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "title" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "dark_logo" TEXT,
    "copyright" TEXT,
    "ga_id" TEXT,
    "index_page_type" "public"."IndexPageType" NOT NULL DEFAULT 'CARD',
    "index_title" TEXT,
    "index_description" TEXT,
    "main_action_text" TEXT,
    "main_action_url" TEXT,
    "is_main_new_tab" BOOLEAN NOT NULL DEFAULT false,
    "sub_action_text" TEXT,
    "sub_action_url" TEXT,
    "is_sub_new_tab" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."files" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."books" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "index_page_type" "public"."IndexPageType" NOT NULL DEFAULT 'CARD',
    "index_title" TEXT,
    "index_description" TEXT,
    "main_action_text" TEXT,
    "main_action_url" TEXT,
    "is_main_new_tab" BOOLEAN NOT NULL DEFAULT false,
    "sub_action_text" TEXT,
    "sub_action_url" TEXT,
    "is_sub_new_tab" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."catalog_nodes" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "prev_id" INTEGER,
    "sibling_id" INTEGER,
    "child_id" INTEGER,
    "title" TEXT NOT NULL,
    "type" "public"."CatalogNodeType" NOT NULL,
    "url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "book_id" INTEGER NOT NULL,
    "doc_id" INTEGER,

    CONSTRAINT "catalog_nodes_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "account_username_key" ON "public"."account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "files_hash_key" ON "public"."files"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "books_slug_key" ON "public"."books"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_nodes_doc_id_key" ON "public"."catalog_nodes"("doc_id");

-- AddForeignKey
ALTER TABLE "public"."catalog_nodes" ADD CONSTRAINT "catalog_nodes_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."catalog_nodes" ADD CONSTRAINT "catalog_nodes_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."docs" ADD CONSTRAINT "docs_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
