/*
  Warnings:

  - A unique constraint covering the columns `[raceId,playerRegistrationId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_raceId_playerRegistrationId_key" ON "Player"("raceId", "playerRegistrationId");
