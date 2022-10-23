/*
  Warnings:

  - You are about to drop the column `classificationId` on the `Category` table. All the data in the column will be lost.
  - Added the required column `isSpecial` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "gender" TEXT,
    "isSpecial" BOOLEAN NOT NULL
);
INSERT INTO "new_Category" ("gender", "id", "maxAge", "minAge", "name") SELECT "gender", "id", "maxAge", "minAge", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
