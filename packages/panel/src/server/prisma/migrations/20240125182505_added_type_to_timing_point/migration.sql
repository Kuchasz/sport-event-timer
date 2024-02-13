/*
  Warnings:

  - You are about to drop the column `isFinish` on the `TimingPoint` table. All the data in the column will be lost.
  - You are about to drop the column `isStart` on the `TimingPoint` table. All the data in the column will be lost.
  - Added the required column `type` to the `TimingPoint` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimingPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "laps" INTEGER,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimingPoint_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimingPoint" ("description", "id", "laps", "name", "raceId", "shortName", "type") 
SELECT 
  "description", 
  "id", 
  "laps", 
  "name", 
  "raceId", 
  "shortName", 
  CASE
    WHEN isStart = 1 THEN 'start'
    WHEN isFinish = 1 THEN 'finish'
    ELSE 'checkpoint'
  END as "type"
FROM "TimingPoint";
DROP TABLE "TimingPoint";
ALTER TABLE "new_TimingPoint" RENAME TO "TimingPoint";
CREATE UNIQUE INDEX "TimingPoint_raceId_name_key" ON "TimingPoint"("raceId", "name");
CREATE UNIQUE INDEX "TimingPoint_raceId_shortName_key" ON "TimingPoint"("raceId", "shortName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
