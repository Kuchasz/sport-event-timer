/*
  Warnings:

  - Made the column `splitId` on table `SplitTime` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SplitTime" (
    "id" INTEGER NOT NULL,
    "bibNumber" TEXT NOT NULL,
    "time" BIGINT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "splitId" INTEGER NOT NULL,

    PRIMARY KEY ("id", "raceId"),
    CONSTRAINT "SplitTime_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "Split" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SplitTime" ("bibNumber", "id", "raceId", "splitId", "time") SELECT "bibNumber", "id", "raceId", "splitId", "time" FROM "SplitTime";
DROP TABLE "SplitTime";
ALTER TABLE "new_SplitTime" RENAME TO "SplitTime";
CREATE UNIQUE INDEX "SplitTime_splitId_bibNumber_key" ON "SplitTime"("splitId", "bibNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
