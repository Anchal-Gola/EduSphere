-- CreateTable
CREATE TABLE "Alumni" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "profilePhoto" TEXT,
    "graduationYear" INTEGER NOT NULL,
    "departmentId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "company" TEXT,
    "jobTitle" TEXT,
    "location" TEXT,
    "linkedin" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alumni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "graduationYear" INTEGER NOT NULL,
    "departmentId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "company" TEXT,
    "jobTitle" TEXT,
    "location" TEXT,
    "linkedin" TEXT,
    "bio" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlumniRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_email_key" ON "Alumni"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniRequest_email_key" ON "AlumniRequest"("email");

-- AddForeignKey
ALTER TABLE "Alumni" ADD CONSTRAINT "Alumni_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumni" ADD CONSTRAINT "Alumni_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
