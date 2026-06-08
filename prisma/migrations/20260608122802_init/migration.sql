-- CreateEnum
CREATE TYPE "CollegeType" AS ENUM ('GOVERNMENT', 'PRIVATE', 'DEEMED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "type" "CollegeType" NOT NULL,
    "establishedYear" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "overallRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "naacGrade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "totalFees" DOUBLE PRECISION NOT NULL,
    "annualFees" DOUBLE PRECISION NOT NULL,
    "seats" INTEGER NOT NULL,
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Placement" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "averagePackage" DOUBLE PRECISION NOT NULL,
    "medianPackage" DOUBLE PRECISION NOT NULL,
    "highestPackage" DOUBLE PRECISION NOT NULL,
    "placementRate" DOUBLE PRECISION NOT NULL,
    "topRecruiters" TEXT[],
    "collegeId" TEXT NOT NULL,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pros" TEXT,
    "cons" TEXT,
    "authorName" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collegeId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCollege" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedCollege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComparisonHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCollege_userId_collegeId_key" ON "SavedCollege"("userId", "collegeId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCollege" ADD CONSTRAINT "SavedCollege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCollege" ADD CONSTRAINT "SavedCollege_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonHistory" ADD CONSTRAINT "ComparisonHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
