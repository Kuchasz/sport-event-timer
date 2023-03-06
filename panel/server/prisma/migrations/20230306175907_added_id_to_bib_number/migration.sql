/*
  Warnings:

  - The primary key for the `BibNumber` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `BibNumber` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BibNumber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "BibNumber_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BibNumber" ("number", "raceId") SELECT "number", "raceId" FROM "BibNumber";
DROP TABLE "BibNumber";
ALTER TABLE "new_BibNumber" RENAME TO "BibNumber";
CREATE UNIQUE INDEX "BibNumber_raceId_number_key" ON "BibNumber"("raceId", "number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
