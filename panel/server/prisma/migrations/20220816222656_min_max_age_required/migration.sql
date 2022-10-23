/*
  Warnings:

  - Made the column `maxAge` on table `AgeCategory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minAge` on table `AgeCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AgeCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "classificationId" INTEGER NOT NULL,
    CONSTRAINT "AgeCategory_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AgeCategory" ("classificationId", "gender", "id", "maxAge", "minAge", "name") SELECT "classificationId", "gender", "id", "maxAge", "minAge", "name" FROM "AgeCategory";
DROP TABLE "AgeCategory";
ALTER TABLE "new_AgeCategory" RENAME TO "AgeCategory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
