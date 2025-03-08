/*
  Warnings:

  - Added the required column `graduationYear` to the `Alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `graduationYear` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alumni" ADD COLUMN     "graduationYear" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "graduationYear" INTEGER NOT NULL;
