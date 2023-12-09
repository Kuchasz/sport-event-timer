/*
  Warnings:

  - You are about to drop the column `registeredByUserId` on the `Player` table. All the data in the column will be lost.
  - Added the required column `promotedByUserId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "startTime" INTEGER,
    "raceId" INTEGER NOT NULL,
    "classificationId" INTEGER NOT NULL,
    "promotedByUserId" TEXT NOT NULL,
    "playerRegistrationId" INTEGER NOT NULL,
    "playerProfileId" INTEGER NOT NULL,
    CONSTRAINT "Player_playerProfileId_fkey" FOREIGN KEY ("playerProfileId") REFERENCES "PlayerProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_promotedByUserId_fkey" FOREIGN KEY ("promotedByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_playerRegistrationId_fkey" FOREIGN KEY ("playerRegistrationId") REFERENCES "PlayerRegistration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("bibNumber", "classificationId", "id", "playerProfileId", "playerRegistrationId", "raceId", "startTime", "promotedByUserId") SELECT "bibNumber", "classificationId", "id", "playerProfileId", "playerRegistrationId", "raceId", "startTime", "registeredByUserId" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_raceId_playerRegistrationId_key" ON "Player"("raceId", "playerRegistrationId");
CREATE UNIQUE INDEX "Player_raceId_bibNumber_key" ON "Player"("raceId", "bibNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
