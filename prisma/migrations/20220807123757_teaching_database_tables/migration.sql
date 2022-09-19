/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userID,slug]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Project_slug_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdmin",
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_teacher" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EnRolled" (
    "userID" INTEGER NOT NULL,
    "moduleID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "moduleID" INTEGER NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "taskID" INTEGER NOT NULL,
    "projectID" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "errors" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "EnRolled_userID_moduleID_key" ON "EnRolled"("userID", "moduleID");

-- CreateIndex
CREATE UNIQUE INDEX "Module_slug_key" ON "Module"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Task_slug_key" ON "Task"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_taskID_projectID_key" ON "Submission"("taskID", "projectID");

-- CreateIndex
CREATE UNIQUE INDEX "Project_userID_slug_key" ON "Project"("userID", "slug");

-- AddForeignKey
ALTER TABLE "EnRolled" ADD CONSTRAINT "EnRolled_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnRolled" ADD CONSTRAINT "EnRolled_moduleID_fkey" FOREIGN KEY ("moduleID") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_moduleID_fkey" FOREIGN KEY ("moduleID") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_taskID_fkey" FOREIGN KEY ("taskID") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
