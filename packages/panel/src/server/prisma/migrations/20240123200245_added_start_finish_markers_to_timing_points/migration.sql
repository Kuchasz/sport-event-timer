/*
  Warnings:

  - Added the required column `isFinish` to the `TimingPoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isStart` to the `TimingPoint` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimingPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "isStart" BOOLEAN NOT NULL,
    "isFinish" BOOLEAN NOT NULL,
    "description" TEXT,
    "laps" INTEGER,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimingPoint_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimingPoint" ("description", "id", "laps", "name", "raceId", "shortName", "isStart", "isFinish") SELECT "description", "id", "laps", "name", "raceId", "shortName", "name" = 'Start' OR "name" = 'Starts', "name" = 'Finish' OR "name" = 'Meta' FROM "TimingPoint";
DROP TABLE "TimingPoint";
ALTER TABLE "new_TimingPoint" RENAME TO "TimingPoint";
CREATE UNIQUE INDEX "TimingPoint_raceId_name_key" ON "TimingPoint"("raceId", "name");
CREATE UNIQUE INDEX "TimingPoint_raceId_shortName_key" ON "TimingPoint"("raceId", "shortName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
