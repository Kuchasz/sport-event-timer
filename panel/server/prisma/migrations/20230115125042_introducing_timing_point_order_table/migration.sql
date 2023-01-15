/*
  Warnings:

  - You are about to drop the column `order` on the `TimingPoint` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "TimingPointOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimingPointOrder_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimingPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimingPoint_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimingPoint" ("description", "id", "name", "raceId") SELECT "description", "id", "name", "raceId" FROM "TimingPoint";
DROP TABLE "TimingPoint";
ALTER TABLE "new_TimingPoint" RENAME TO "TimingPoint";
CREATE UNIQUE INDEX "TimingPoint_raceId_name_key" ON "TimingPoint"("raceId", "name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
