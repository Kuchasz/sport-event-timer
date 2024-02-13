/*
  Warnings:

  - Made the column `time` on table `ManualSplitTime` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ManualSplitTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "time" BIGINT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    "lap" INTEGER NOT NULL,
    CONSTRAINT "ManualSplitTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManualSplitTime_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManualSplitTime_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ManualSplitTime" ("bibNumber", "id", "lap", "raceId", "time", "timingPointId") SELECT "bibNumber", "id", "lap", "raceId", "time", "timingPointId" FROM "ManualSplitTime";
DROP TABLE "ManualSplitTime";
ALTER TABLE "new_ManualSplitTime" RENAME TO "ManualSplitTime";
CREATE UNIQUE INDEX "ManualSplitTime_timingPointId_lap_bibNumber_key" ON "ManualSplitTime"("timingPointId", "lap", "bibNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
