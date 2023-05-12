-- CreateTable
CREATE TABLE "Absence" (
    "id" INTEGER NOT NULL,
    "bibNumber" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "timingPointId" INTEGER NOT NULL,

    PRIMARY KEY ("id", "raceId"),
    CONSTRAINT "Absence_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Absence_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Absence_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "Player" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Absence_timingPointId_bibNumber_key" ON "Absence"("timingPointId", "bibNumber");
