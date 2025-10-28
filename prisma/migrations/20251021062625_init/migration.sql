-- CreateEnum
CREATE TYPE "public"."BookType" AS ENUM ('BLOGS', 'DOCS', 'PAGES', 'NAVBAR');

-- CreateEnum
CREATE TYPE "public"."TreeNodeType" AS ENUM ('DOC', 'GROUP', 'LINK');

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
    "home_page" TEXT,
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
    "type" "public"."BookType" NOT NULL DEFAULT 'BLOGS',
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."docs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB,
    "cover" TEXT,
    "summary" TEXT,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "book_id" INTEGER NOT NULL,

    CONSTRAINT "docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tree_nodes" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "prev_id" INTEGER,
    "sibling_id" INTEGER,
    "child_id" INTEGER,
    "type" "public"."TreeNodeType" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "is_external" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "book_id" INTEGER NOT NULL,
    "doc_id" INTEGER,

    CONSTRAINT "tree_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_username_key" ON "public"."account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "files_hash_key" ON "public"."files"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "books_slug_key" ON "public"."books"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tree_nodes_doc_id_key" ON "public"."tree_nodes"("doc_id");

-- AddForeignKey
ALTER TABLE "public"."docs" ADD CONSTRAINT "docs_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tree_nodes" ADD CONSTRAINT "tree_nodes_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tree_nodes" ADD CONSTRAINT "tree_nodes_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."docs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
