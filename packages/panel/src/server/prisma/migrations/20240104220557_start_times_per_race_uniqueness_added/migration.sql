/*
  Warnings:

  - A unique constraint covering the columns `[raceId,startTime]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_raceId_startTime_key" ON "Player"("raceId", "startTime");
