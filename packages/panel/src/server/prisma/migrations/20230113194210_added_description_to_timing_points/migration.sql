/*
  Warnings:

  - Made the column `hasPaid` on table `PlayerRegistration` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TimingPoint" ADD COLUMN "description" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayerRegistration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "registrationDate" DATETIME NOT NULL,
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
    "hasPaid" BOOLEAN NOT NULL,
    "paymentDate" DATETIME,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "PlayerRegistration_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerRegistration" ("birthDate", "city", "country", "email", "gender", "hasPaid", "icePhoneNumber", "id", "lastName", "name", "paymentDate", "phoneNumber", "raceId", "registrationDate", "team") SELECT "birthDate", "city", "country", "email", "gender", "hasPaid", "icePhoneNumber", "id", "lastName", "name", "paymentDate", "phoneNumber", "raceId", "registrationDate", "team" FROM "PlayerRegistration";
DROP TABLE "PlayerRegistration";
ALTER TABLE "new_PlayerRegistration" RENAME TO "PlayerRegistration";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
