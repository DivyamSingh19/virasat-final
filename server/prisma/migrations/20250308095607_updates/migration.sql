-- CreateTable
CREATE TABLE "StudentData" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "prn_number" TEXT NOT NULL,

    CONSTRAINT "StudentData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniData" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,

    CONSTRAINT "AlumniData_pkey" PRIMARY KEY ("id")
);
