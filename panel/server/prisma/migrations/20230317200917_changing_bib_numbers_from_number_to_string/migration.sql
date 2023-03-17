-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ManualSplitTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "time" BIGINT,
    "raceId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    CONSTRAINT "ManualSplitTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManualSplitTime_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ManualSplitTime_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ManualSplitTime" ("bibNumber", "id", "raceId", "time", "timingPointId") SELECT "bibNumber", "id", "raceId", "time", "timingPointId" FROM "ManualSplitTime";
DROP TABLE "ManualSplitTime";
ALTER TABLE "new_ManualSplitTime" RENAME TO "ManualSplitTime";
CREATE UNIQUE INDEX "ManualSplitTime_timingPointId_bibNumber_key" ON "ManualSplitTime"("timingPointId", "bibNumber");
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "bibNumber" TEXT,
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
INSERT INTO "new_Player" ("bibNumber", "birthDate", "city", "classificationId", "country", "email", "gender", "icePhoneNumber", "id", "lastName", "name", "phoneNumber", "playerRegistrationId", "raceId", "registeredByUserId", "startTime", "team") SELECT "bibNumber", "birthDate", "city", "classificationId", "country", "email", "gender", "icePhoneNumber", "id", "lastName", "name", "phoneNumber", "playerRegistrationId", "raceId", "registeredByUserId", "startTime", "team" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_raceId_bibNumber_key" ON "Player"("raceId", "bibNumber");
CREATE UNIQUE INDEX "Player_classificationId_startTime_key" ON "Player"("classificationId", "startTime");
CREATE TABLE "new_SplitTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "time" BIGINT,
    "raceId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    CONSTRAINT "SplitTime_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SplitTime_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SplitTime" ("bibNumber", "id", "raceId", "time", "timingPointId") SELECT "bibNumber", "id", "raceId", "time", "timingPointId" FROM "SplitTime";
DROP TABLE "SplitTime";
ALTER TABLE "new_SplitTime" RENAME TO "SplitTime";
CREATE UNIQUE INDEX "SplitTime_timingPointId_bibNumber_key" ON "SplitTime"("timingPointId", "bibNumber");
CREATE TABLE "new_BibNumber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "BibNumber_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BibNumber" ("id", "number", "raceId") SELECT "id", "number", "raceId" FROM "BibNumber";
DROP TABLE "BibNumber";
ALTER TABLE "new_BibNumber" RENAME TO "BibNumber";
CREATE UNIQUE INDEX "BibNumber_raceId_number_key" ON "BibNumber"("raceId", "number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
