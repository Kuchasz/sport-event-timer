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
    "playerRegistrationId" INTEGER,
    CONSTRAINT "Player_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_registeredByUserId_fkey" FOREIGN KEY ("registeredByUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Player_playerRegistrationId_fkey" FOREIGN KEY ("playerRegistrationId") REFERENCES "PlayerRegistration" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("bibNumber", "birthDate", "city", "classificationId", "country", "email", "gender", "icePhoneNumber", "id", "lastName", "name", "phoneNumber", "raceId", "registeredByUserId", "startTime", "team") SELECT "bibNumber", "birthDate", "city", "classificationId", "country", "email", "gender", "icePhoneNumber", "id", "lastName", "name", "phoneNumber", "raceId", "registeredByUserId", "startTime", "team" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_raceId_bibNumber_key" ON "Player"("raceId", "bibNumber");
CREATE UNIQUE INDEX "Player_classificationId_startTime_key" ON "Player"("classificationId", "startTime");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
