/*
  Warnings:

  - You are about to drop the column `created_by` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `update_by` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `update_by` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Block" DROP COLUMN "created_by",
DROP COLUMN "update_by";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "created_by",
DROP COLUMN "update_by";
