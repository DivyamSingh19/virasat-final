/*
  Warnings:

  - The primary key for the `AlumniData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AlumniData` table. All the data in the column will be lost.
  - The primary key for the `StudentData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StudentData` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_receiverAlumniId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_receiverStudentId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_senderAlumniId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_senderStudentId_fkey";

-- AlterTable
ALTER TABLE "AlumniData" DROP CONSTRAINT "AlumniData_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AlumniData_pkey" PRIMARY KEY ("fullName");

-- AlterTable
ALTER TABLE "StudentData" DROP CONSTRAINT "StudentData_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "StudentData_pkey" PRIMARY KEY ("fullName");

-- DropTable
DROP TABLE "Chat";
