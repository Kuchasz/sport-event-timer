-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SplitTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" INTEGER NOT NULL,
    "measuredTime" BIGINT,
    "adjustedTime" BIGINT,
    "raceId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    CONSTRAINT "SplitTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SplitTime" ("adjustedTime", "bibNumber", "id", "measuredTime", "raceId", "timingPointId") SELECT "adjustedTime", "bibNumber", "id", "measuredTime", "raceId", "timingPointId" FROM "SplitTime";
DROP TABLE "SplitTime";
ALTER TABLE "new_SplitTime" RENAME TO "SplitTime";
CREATE UNIQUE INDEX "SplitTime_timingPointId_bibNumber_key" ON "SplitTime"("timingPointId", "bibNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
