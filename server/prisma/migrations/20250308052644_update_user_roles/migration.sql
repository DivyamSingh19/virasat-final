/*
  Warnings:

  - Added the required column `branch` to the `Alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('COMPUTER_ENGINEERING', 'INFORMATION_TECHNOLOGY', 'CSE_AI_ML', 'ELECTRONICS_COMPUTER_SCIENCE', 'MECHATRONICS_ENGINEERING', 'HUMANITIES_BASIC_SCIENCES', 'BACHELOR_OF_FINE_ART');

-- AlterTable
ALTER TABLE "Alumni" ADD COLUMN     "branch" "Branch" NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "branch" "Branch" NOT NULL;
