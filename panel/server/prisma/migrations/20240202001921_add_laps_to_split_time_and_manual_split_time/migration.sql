/*
  Warnings:

  - Added the required column `lap` to the `ManualSplitTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lap` to the `SplitTime` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables

DELETE FROM "ManualSplitTime"
WHERE raceId = 1;

DELETE FROM "SplitTime"
WHERE raceId = 1;

PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ManualSplitTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "time" BIGINT,
    "raceId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    "lap" INTEGER NOT NULL,
    CONSTRAINT "ManualSplitTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManualSplitTime_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManualSplitTime_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ManualSplitTime" ("bibNumber", "id", "raceId", "time", "timingPointId", "lap") SELECT "bibNumber", "id", "raceId", "time", "timingPointId", 0 FROM "ManualSplitTime";
DROP TABLE "ManualSplitTime";
ALTER TABLE "new_ManualSplitTime" RENAME TO "ManualSplitTime";
CREATE UNIQUE INDEX "ManualSplitTime_timingPointId_lap_bibNumber_key" ON "ManualSplitTime"("timingPointId", "lap", "bibNumber");
CREATE TABLE "new_SplitTime" (
    "id" INTEGER NOT NULL,
    "bibNumber" TEXT NOT NULL,
    "time" BIGINT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    "lap" INTEGER NOT NULL,

    PRIMARY KEY ("id", "raceId"),
    CONSTRAINT "SplitTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SplitTime" ("bibNumber", "id", "raceId", "time", "timingPointId", "lap") SELECT "bibNumber", "id", "raceId", "time", "timingPointId", 0 FROM "SplitTime";
DROP TABLE "SplitTime";
ALTER TABLE "new_SplitTime" RENAME TO "SplitTime";
CREATE UNIQUE INDEX "SplitTime_timingPointId_lap_bibNumber_key" ON "SplitTime"("timingPointId", "lap", "bibNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

UPDATE "Stopwatch"
SET "state" = json_object(
    'timeStamps', (
        SELECT json_group_array(
            json_set(json_each.value, '$."lap"', 0)
        )
        FROM json_each(state, '$."timeStamps"')
    ),
    'absences', json_extract(state, '$."absences"'),
    'actionsHistory', json_extract(state, '$."actionsHistory"')
);

UPDATE "Stopwatch"
SET "state" = json_insert(
    json_remove(state, '$."timeStamps"'),
    '$."splitTimes"',
    json_extract(state, '$."timeStamps"')
);
