/*
  Warnings:

  - A unique constraint covering the columns `[raceId,name]` on the table `Classification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Classification_raceId_name_key" ON "Classification"("raceId", "name");
