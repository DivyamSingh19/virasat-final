/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Alumni` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `degree` to the `Alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `degree` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Degree" AS ENUM ('BE', 'ME');

-- AlterTable
ALTER TABLE "Alumni" ADD COLUMN     "bio" VARCHAR(600),
ADD COLUMN     "degree" "Degree" NOT NULL,
ADD COLUMN     "githubProfile" TEXT,
ADD COLUMN     "interests" VARCHAR(5)[],
ADD COLUMN     "linkedinProfile" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "skills" VARCHAR(5)[];

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "bio" VARCHAR(600),
ADD COLUMN     "branch" "Branch" NOT NULL,
ADD COLUMN     "degree" "Degree" NOT NULL,
ADD COLUMN     "githubProfile" TEXT,
ADD COLUMN     "interests" VARCHAR(5)[],
ADD COLUMN     "linkedinProfile" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "skills" VARCHAR(5)[];

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_phoneNumber_key" ON "Alumni"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Student_phoneNumber_key" ON "Student"("phoneNumber");
