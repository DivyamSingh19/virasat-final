/*
  Warnings:

  - The primary key for the `StudentData` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AlumniData" ADD COLUMN     "branch" TEXT NOT NULL DEFAULT 'Unknown';

-- AlterTable
ALTER TABLE "StudentData" DROP CONSTRAINT "StudentData_pkey",
ADD COLUMN     "branch" TEXT NOT NULL DEFAULT 'Unknown',
ADD CONSTRAINT "StudentData_pkey" PRIMARY KEY ("prn_number");
