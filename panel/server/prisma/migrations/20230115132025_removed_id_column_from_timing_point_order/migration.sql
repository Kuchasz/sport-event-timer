/*
  Warnings:

  - The primary key for the `TimingPointOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TimingPointOrder` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimingPointOrder" (
    "order" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "TimingPointOrder_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimingPointOrder" ("order", "raceId") SELECT "order", "raceId" FROM "TimingPointOrder";
DROP TABLE "TimingPointOrder";
ALTER TABLE "new_TimingPointOrder" RENAME TO "TimingPointOrder";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
