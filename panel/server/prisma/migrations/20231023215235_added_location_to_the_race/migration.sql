/*
  Warnings:

  - Added the required column `location` to the `Race` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "termsUrl" TEXT,
    "emailTemplate" TEXT,
    "playersLimit" INTEGER,
    "registrationEnabled" BOOLEAN NOT NULL
);
INSERT INTO "new_Race" ("date", "description", "location", "emailTemplate", "id", "name", "playersLimit", "registrationEnabled", "termsUrl") SELECT "date", "description", 'Tampa, CA', "emailTemplate", "id", "name", "playersLimit", "registrationEnabled", "termsUrl" FROM "Race";
DROP TABLE "Race";
ALTER TABLE "new_Race" RENAME TO "Race";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
