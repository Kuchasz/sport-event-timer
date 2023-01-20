/*
  Warnings:

  - Added the required column `expireTime` to the `TimingPointAccessKey` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimingPointAccessKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "canAccessOthers" BOOLEAN NOT NULL,
    "token" TEXT NOT NULL,
    "expireDate" DATETIME NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimingPointAccessKey_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimingPointAccessKey_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
DELETE FROM 'TimingPointAccessKey';
INSERT INTO "new_TimingPointAccessKey" ("canAccessOthers", "code", "id", "name", "raceId", "timingPointId", "token", "expireDate") SELECT "canAccessOthers", "code", "id", "name", "raceId", "timingPointId", "token", DATE('now') FROM "TimingPointAccessKey";
DROP TABLE "TimingPointAccessKey";
ALTER TABLE "new_TimingPointAccessKey" RENAME TO "TimingPointAccessKey";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
