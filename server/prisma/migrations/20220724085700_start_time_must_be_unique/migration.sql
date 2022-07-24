/*
  Warnings:

  - A unique constraint covering the columns `[classificationId,startTime]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_classificationId_startTime_key" ON "Player"("classificationId", "startTime");
