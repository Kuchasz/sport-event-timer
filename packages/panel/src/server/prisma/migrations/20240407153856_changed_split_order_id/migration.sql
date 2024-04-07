/*
  Warnings:

  - The primary key for the `SplitOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SplitOrder" (
    "order" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "classificationId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "SplitOrder_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitOrder_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SplitOrder" ("classificationId", "order", "raceId") SELECT "classificationId", "order", "raceId" FROM "SplitOrder";
DROP TABLE "SplitOrder";
ALTER TABLE "new_SplitOrder" RENAME TO "SplitOrder";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
