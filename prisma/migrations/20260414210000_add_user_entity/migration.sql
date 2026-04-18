-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- Migrate legacy account row (if any) to first ADMIN user
INSERT INTO "users" ("id", "username", "password", "role", "created_at", "updated_at")
SELECT
    gen_random_uuid()::text,
    a."username",
    a."password",
    'ADMIN',
    a."created_at",
    a."updated_at"
FROM "account" a
WHERE a."id" = 'default'
  AND NOT EXISTS (
    SELECT 1
    FROM "users" u
    WHERE u."username" = a."username"
  );
