/*
  Warnings:

  - Added the required column `abbrev` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "abbrev" TEXT NOT NULL,
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "gender" TEXT,
    "isSpecial" BOOLEAN NOT NULL,
    "classificationId" INTEGER NOT NULL,
    CONSTRAINT "Category_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("classificationId", "gender", "id", "isSpecial", "maxAge", "minAge", "name") SELECT "classificationId", "gender", "id", "isSpecial", "maxAge", "minAge", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
