/*
  Warnings:

  - You are about to alter the column `distanceFromStart` on the `Split` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Split" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "classificationId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    "distanceFromStart" INTEGER,
    CONSTRAINT "Split_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Split_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Split_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Split" ("classificationId", "distanceFromStart", "id", "name", "raceId", "timingPointId") SELECT "classificationId", "distanceFromStart", "id", "name", "raceId", "timingPointId" FROM "Split";
DROP TABLE "Split";
ALTER TABLE "new_Split" RENAME TO "Split";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
