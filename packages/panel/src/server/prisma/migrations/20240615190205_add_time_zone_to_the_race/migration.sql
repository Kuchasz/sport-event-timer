/*
  Warnings:

  - Added the required column `timeZone` to the `Race` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "sportKind" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "termsUrl" TEXT,
    "websiteUrl" TEXT,
    "emailTemplate" TEXT,
    "playersLimit" INTEGER,
    "registrationEnabled" BOOLEAN NOT NULL,
    "registrationCutoff" DATETIME,
    "timeZone" TEXT NOT NULL
);
INSERT INTO "new_Race" ("date", "description", "emailTemplate", "id", "location", "name", "playersLimit", "registrationCutoff", "registrationEnabled", "sportKind", "termsUrl", "websiteUrl") SELECT "date", "description", "emailTemplate", "id", "location", "name", "playersLimit", "registrationCutoff", "registrationEnabled", "sportKind", "termsUrl", "websiteUrl" FROM "Race";
DROP TABLE "Race";
ALTER TABLE "new_Race" RENAME TO "Race";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
