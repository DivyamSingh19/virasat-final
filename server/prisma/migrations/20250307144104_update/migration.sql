/*
  Warnings:

  - Added the required column `prn_number` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "prn_number" TEXT NOT NULL;
