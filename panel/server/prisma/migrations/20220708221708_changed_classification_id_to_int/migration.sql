/*
  Warnings:

  - The primary key for the `Classification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Classification` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `classificationId` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "Classification_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Classification" ("id", "name", "raceId") SELECT "id", "name", "raceId" FROM "Classification";
DROP TABLE "Classification";
ALTER TABLE "new_Classification" RENAME TO "Classification";
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "icePhoneNumber" TEXT NOT NULL,
    "classificationId" INTEGER NOT NULL,
    "registeredByUserId" INTEGER NOT NULL,
    CONSTRAINT "Player_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_registeredByUserId_fkey" FOREIGN KEY ("registeredByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("birthDate", "city", "classificationId", "country", "email", "gender", "icePhoneNumber", "id", "lastName", "name", "phoneNumber", "registeredByUserId", "team") SELECT "birthDate", "city", "classificationId", "country", "email", "gender", "icePhoneNumber", "id", "lastName", "name", "phoneNumber", "registeredByUserId", "team" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
