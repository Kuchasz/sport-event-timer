/*
  Warnings:

  - You are about to drop the column `timingPointId` on the `Absence` table. All the data in the column will be lost.
  - You are about to drop the column `lap` on the `SplitTime` table. All the data in the column will be lost.
  - You are about to drop the column `timingPointId` on the `SplitTime` table. All the data in the column will be lost.
  - You are about to drop the column `laps` on the `TimingPoint` table. All the data in the column will be lost.
  - You are about to drop the column `lap` on the `ManualSplitTime` table. All the data in the column will be lost.
  - You are about to drop the column `timingPointId` on the `ManualSplitTime` table. All the data in the column will be lost.
  - Added the required column `splitId` to the `Absence` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Split" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "classificationId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    CONSTRAINT "Split_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Split_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SplitOrder" (
    "order" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classificationId" INTEGER NOT NULL,
    CONSTRAINT "SplitOrder_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitOrder_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Absence" (
    "id" INTEGER NOT NULL,
    "bibNumber" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "splitId" INTEGER NOT NULL,

    PRIMARY KEY ("id", "raceId"),
    CONSTRAINT "Absence_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Absence_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Absence_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "Split" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Absence" ("bibNumber", "id", "raceId") SELECT "bibNumber", "id", "raceId" FROM "Absence";
DROP TABLE "Absence";
ALTER TABLE "new_Absence" RENAME TO "Absence";
CREATE UNIQUE INDEX "Absence_splitId_bibNumber_key" ON "Absence"("splitId", "bibNumber");
CREATE TABLE "new_TimePenalty" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimePenalty_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimePenalty_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimePenalty" ("bibNumber", "id", "raceId", "reason", "time") SELECT "bibNumber", "id", "raceId", "reason", "time" FROM "TimePenalty";
DROP TABLE "TimePenalty";
ALTER TABLE "new_TimePenalty" RENAME TO "TimePenalty";
CREATE TABLE "new_SplitTime" (
    "id" INTEGER NOT NULL,
    "bibNumber" TEXT NOT NULL,
    "time" BIGINT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "splitId" INTEGER,

    PRIMARY KEY ("id", "raceId"),
    CONSTRAINT "SplitTime_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "Split" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SplitTime" ("bibNumber", "id", "raceId", "time") SELECT "bibNumber", "id", "raceId", "time" FROM "SplitTime";
DROP TABLE "SplitTime";
ALTER TABLE "new_SplitTime" RENAME TO "SplitTime";
CREATE UNIQUE INDEX "SplitTime_splitId_bibNumber_key" ON "SplitTime"("splitId", "bibNumber");
CREATE TABLE "new_TimingPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimingPoint_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimingPoint" ("description", "id", "name", "raceId", "shortName", "type") SELECT "description", "id", "name", "raceId", "shortName", "type" FROM "TimingPoint";
DROP TABLE "TimingPoint";
ALTER TABLE "new_TimingPoint" RENAME TO "TimingPoint";
CREATE UNIQUE INDEX "TimingPoint_raceId_name_key" ON "TimingPoint"("raceId", "name");
CREATE UNIQUE INDEX "TimingPoint_raceId_shortName_key" ON "TimingPoint"("raceId", "shortName");
CREATE TABLE "new_Disqualification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "Disqualification_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Disqualification_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Disqualification" ("bibNumber", "id", "raceId", "reason") SELECT "bibNumber", "id", "raceId", "reason" FROM "Disqualification";
DROP TABLE "Disqualification";
ALTER TABLE "new_Disqualification" RENAME TO "Disqualification";
CREATE UNIQUE INDEX "Disqualification_raceId_bibNumber_key" ON "Disqualification"("raceId", "bibNumber");
CREATE TABLE "new_ManualSplitTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "time" BIGINT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "splitId" INTEGER,
    CONSTRAINT "ManualSplitTime_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManualSplitTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManualSplitTime_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "Split" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ManualSplitTime" ("bibNumber", "id", "raceId", "time") SELECT "bibNumber", "id", "raceId", "time" FROM "ManualSplitTime";
DROP TABLE "ManualSplitTime";
ALTER TABLE "new_ManualSplitTime" RENAME TO "ManualSplitTime";
CREATE UNIQUE INDEX "ManualSplitTime_splitId_bibNumber_key" ON "ManualSplitTime"("splitId", "bibNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
