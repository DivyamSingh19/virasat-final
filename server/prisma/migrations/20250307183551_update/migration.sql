/*
  Warnings:

  - You are about to drop the column `adminId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `featuredImage` on the `Job` table. All the data in the column will be lost.
  - Added the required column `postedById` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_adminId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "adminId",
DROP COLUMN "featuredImage",
ADD COLUMN     "expired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "postedById" TEXT NOT NULL,
ADD COLUMN     "salary" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "Alumni"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
