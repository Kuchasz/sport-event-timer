-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
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
