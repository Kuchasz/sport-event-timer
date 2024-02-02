/*
  Warnings:

  - Made the column `laps` on table `TimingPoint` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables

UPDATE "TimingPoint"
SET laps = 0
WHERE laps is null;

PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimingPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "laps" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimingPoint_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimingPoint" ("description", "id", "laps", "name", "raceId", "shortName", "type") SELECT "description", "id", "laps", "name", "raceId", "shortName", "type" FROM "TimingPoint";
DROP TABLE "TimingPoint";
ALTER TABLE "new_TimingPoint" RENAME TO "TimingPoint";
CREATE UNIQUE INDEX "TimingPoint_raceId_name_key" ON "TimingPoint"("raceId", "name");
CREATE UNIQUE INDEX "TimingPoint_raceId_shortName_key" ON "TimingPoint"("raceId", "shortName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
