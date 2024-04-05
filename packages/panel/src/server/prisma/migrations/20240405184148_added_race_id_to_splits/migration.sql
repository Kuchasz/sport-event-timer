/*
  Warnings:

  - Added the required column `raceId` to the `Split` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Split" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "classificationId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    CONSTRAINT "Split_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Split_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Split_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Split" ("classificationId", "id", "name", "timingPointId") SELECT "classificationId", "id", "name", "timingPointId" FROM "Split";
DROP TABLE "Split";
ALTER TABLE "new_Split" RENAME TO "Split";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
