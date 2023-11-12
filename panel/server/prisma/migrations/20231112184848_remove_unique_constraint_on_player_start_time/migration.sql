-- DropIndex
DROP INDEX "Player_classificationId_startTime_key";

-- CreateTable
CREATE TABLE "TimePenalty" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "time" BIGINT NOT NULL,
    "reason" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimePenalty_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Disqualification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "Disqualification_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Disqualification_raceId_bibNumber_key" ON "Disqualification"("raceId", "bibNumber");
