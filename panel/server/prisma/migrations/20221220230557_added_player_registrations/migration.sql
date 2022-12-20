/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `login` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerRegistration" (
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
    "icePhoneNumber" TEXT,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "PlayerRegistration_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "bibNumber" INTEGER,
    "startTime" INTEGER,
    "team" TEXT,
    "city" TEXT,
    "country" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "icePhoneNumber" TEXT,
    "raceId" INTEGER NOT NULL,
    "classificationId" INTEGER NOT NULL,
    "registeredByUserId" TEXT NOT NULL,
    CONSTRAINT "Player_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_registeredByUserId_fkey" FOREIGN KEY ("registeredByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("bibNumber", "birthDate", "city", "classificationId", "country", "email", "gender", "icePhoneNumber", "id", "lastName", "name", "phoneNumber", "raceId", "registeredByUserId", "startTime", "team") SELECT "bibNumber", "birthDate", "city", "classificationId", "country", "email", "gender", "icePhoneNumber", "id", "lastName", "name", "phoneNumber", "raceId", "registeredByUserId", "startTime", "team" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_raceId_bibNumber_key" ON "Player"("raceId", "bibNumber");
CREATE UNIQUE INDEX "Player_classificationId_startTime_key" ON "Player"("classificationId", "startTime");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT
);
INSERT INTO "new_User" ("id") SELECT "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
