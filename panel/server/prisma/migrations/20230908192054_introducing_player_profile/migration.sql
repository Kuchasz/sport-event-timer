/*
  Warnings:

  - You are about to drop the column `birthDate` on the `PlayerRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `PlayerRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `PlayerRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `PlayerRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `PlayerRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `icePhoneNumber` on the `PlayerRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `PlayerRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `PlayerRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `PlayerRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `team` on the `PlayerRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `icePhoneNumber` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `team` on the `Player` table. All the data in the column will be lost.
  - Added the required column `playerProfileId` to the `PlayerRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerProfileId` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Made the column `playerRegistrationId` on table `Player` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "PlayerProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "team" TEXT,
    "city" TEXT,
    "country" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "icePhoneNumber" TEXT
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayerRegistration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "registrationDate" DATETIME NOT NULL,
    "hasPaid" BOOLEAN NOT NULL,
    "paymentDate" DATETIME,
    "raceId" INTEGER NOT NULL,
    "playerProfileId" INTEGER NOT NULL,
    CONSTRAINT "PlayerRegistration_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerRegistration_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerRegistration" ("hasPaid", "id", "paymentDate", "raceId", "registrationDate") SELECT "hasPaid", "id", "paymentDate", "raceId", "registrationDate" FROM "PlayerRegistration";
DROP TABLE "PlayerRegistration";
ALTER TABLE "new_PlayerRegistration" RENAME TO "PlayerRegistration";
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT,
    "startTime" INTEGER,
    "raceId" INTEGER NOT NULL,
    "classificationId" INTEGER NOT NULL,
    "registeredByUserId" TEXT NOT NULL,
    "playerRegistrationId" INTEGER NOT NULL,
    "playerProfileId" INTEGER NOT NULL,
    CONSTRAINT "Player_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_registeredByUserId_fkey" FOREIGN KEY ("registeredByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_playerRegistrationId_fkey" FOREIGN KEY ("playerRegistrationId") REFERENCES "PlayerRegistration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("bibNumber", "classificationId", "id", "playerRegistrationId", "raceId", "registeredByUserId", "startTime") SELECT "bibNumber", "classificationId", "id", "playerRegistrationId", "raceId", "registeredByUserId", "startTime" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_raceId_bibNumber_key" ON "Player"("raceId", "bibNumber");
CREATE UNIQUE INDEX "Player_classificationId_startTime_key" ON "Player"("classificationId", "startTime");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
