/*
  Warnings:

  - You are about to alter the column `time` on the `TimePenalty` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimePenalty" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimePenalty_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimePenalty" ("bibNumber", "id", "raceId", "reason", "time") SELECT "bibNumber", "id", "raceId", "reason", "time" FROM "TimePenalty";
DROP TABLE "TimePenalty";
ALTER TABLE "new_TimePenalty" RENAME TO "TimePenalty";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
