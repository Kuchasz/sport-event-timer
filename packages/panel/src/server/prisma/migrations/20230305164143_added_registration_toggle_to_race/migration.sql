/*
  Warnings:

  - Added the required column `registrationEnabled` to the `Race` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "playersLimit" INTEGER,
    "registrationEnabled" BOOLEAN
);

INSERT INTO "new_Race" ("date", "id", "name", "playersLimit", "registrationEnabled") SELECT "date", "id", "name", "playersLimit", false FROM "Race";

CREATE TABLE "new_Race_nn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "playersLimit" INTEGER,
    "registrationEnabled" BOOLEAN NOT NULL
);

INSERT INTO "new_Race_nn" ("date", "id", "name", "playersLimit", "registrationEnabled") SELECT "date", "id", "name", "playersLimit", "registrationEnabled" FROM "new_Race";

DROP TABLE "Race";
DROP TABLE "new_Race";
ALTER TABLE "new_Race_nn" RENAME TO "Race";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
