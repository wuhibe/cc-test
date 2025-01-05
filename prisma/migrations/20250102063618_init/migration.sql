-- CreateTable
CREATE TABLE "reply_examples" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "embedding" TEXT NOT NULL,
    "character_count" INTEGER NOT NULL,
    "reply" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reply_examples_pkey" PRIMARY KEY ("id")
);
