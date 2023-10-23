/*
  Warnings:

  - Added the required column `description` to the `Race` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "termsUrl" TEXT,
    "emailTemplate" TEXT,
    "playersLimit" INTEGER,
    "registrationEnabled" BOOLEAN NOT NULL
);
INSERT INTO "new_Race" ("date", "emailTemplate", "id", "description", "name", "playersLimit", "registrationEnabled", "termsUrl") SELECT "date", "emailTemplate", "id", 'Another cycling race that may be handled in that application', "name", "playersLimit", "registrationEnabled", "termsUrl" FROM "Race";
DROP TABLE "Race";
ALTER TABLE "new_Race" RENAME TO "Race";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
