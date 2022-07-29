/*
  Warnings:

  - You are about to drop the column `time` on the `SplitTime` table. All the data in the column will be lost.
  - Added the required column `adjustedTime` to the `SplitTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measuredTime` to the `SplitTime` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SplitTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" INTEGER NOT NULL,
    "measuredTime" BIGINT NOT NULL,
    "adjustedTime" BIGINT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    CONSTRAINT "SplitTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SplitTime" ("bibNumber", "id", "raceId", "timingPointId") SELECT "bibNumber", "id", "raceId", "timingPointId" FROM "SplitTime";
DROP TABLE "SplitTime";
ALTER TABLE "new_SplitTime" RENAME TO "SplitTime";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
