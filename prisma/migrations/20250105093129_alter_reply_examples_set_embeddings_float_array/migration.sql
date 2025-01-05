/*
  Warnings:

  - The `embedding` column on the `reply_examples` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "reply_examples" DROP COLUMN "embedding",
ADD COLUMN     "embedding" DOUBLE PRECISION[];
