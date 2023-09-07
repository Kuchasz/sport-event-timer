/*
  Warnings:

  - You are about to drop the `TimingPointAccessKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TimingPointAccessKey";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TimingPointAccessUrl" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "canAccessOthers" BOOLEAN NOT NULL,
    "token" TEXT NOT NULL,
    "expireDate" DATETIME NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimingPointAccessUrl_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimingPointAccessUrl_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
