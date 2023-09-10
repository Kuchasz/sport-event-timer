INSERT INTO PlayerRegistration (registrationDate, name, lastName, birthDate, gender, team, city, country, email, phoneNumber, icePhoneNumber, hasPaid, paymentDate, raceId) SELECT date('now'), name, lastName, birthDate, gender, team, city, country, email, phoneNumber, icePhoneNumber, 1, date('now'), raceId FROM Player WHERE playerRegistrationId IS NULL;
UPDATE Player SET playerRegistrationId = (SELECT pr.id FROM PlayerRegistration pr WHERE pr.name = Player.name AND pr.lastName = Player.lastName AND pr.raceId = Player.raceId AND pr.birthDate = Player.birthDate) WHERE playerRegistrationId IS NULL;

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
    "icePhoneNumber" TEXT,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "PlayerRegistration_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "PlayerProfile" ("name", "lastName", "birthDate", "gender", "team", "city", "country", "email", "phoneNumber", "icePhoneNumber", "raceId") 
SELECT p."name", p."lastName", p."birthDate", p."gender", p."team", p."city", p."country", p."email", p."phoneNumber", p."icePhoneNumber", p."raceId" FROM "PlayerRegistration" p LEFT OUTER JOIN "Player" pr ON p.name = pr.name AND p.lastName = pr.lastName AND p.raceId = pr.raceId AND p.birthDate = pr.birthDate;

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

INSERT INTO "new_PlayerRegistration" ("hasPaid", "id", "paymentDate", "raceId", "registrationDate", "playerProfileId") SELECT "hasPaid", p."id", "paymentDate", p."raceId", "registrationDate", 1 FROM "PlayerRegistration" p;
UPDATE new_PlayerRegistration SET playerProfileId = (SELECT pp.id FROM PlayerRegistration p JOIN PlayerProfile pp ON p.name = pp.name AND p.lastName = pp.lastName AND p.raceId = pp.raceId AND p.birthDate = pp.birthDate WHERE new_PlayerRegistration.id = p.id);

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

INSERT INTO "new_Player" ("bibNumber", "classificationId", "id", "playerRegistrationId", "raceId", "registeredByUserId", "startTime", "playerProfileId") SELECT "bibNumber", "classificationId", "id", "playerRegistrationId", "raceId", "registeredByUserId", "startTime", 1 FROM "Player";
UPDATE new_Player SET playerProfileId = (SELECT pp.id FROM Player pl JOIN PlayerRegistration p ON pl.playerRegistrationId = p.id JOIN PlayerProfile pp ON p.name = pp.name AND p.lastName = pp.lastName AND p.raceId = pp.raceId AND p.birthDate = pp.birthDate WHERE new_Player.id = pl.id);

DROP TABLE "PlayerRegistration";
DROP TABLE "Player";
ALTER TABLE "new_PlayerRegistration" RENAME TO "PlayerRegistration";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_raceId_bibNumber_key" ON "Player"("raceId", "bibNumber");
CREATE UNIQUE INDEX "Player_classificationId_startTime_key" ON "Player"("classificationId", "startTime");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
