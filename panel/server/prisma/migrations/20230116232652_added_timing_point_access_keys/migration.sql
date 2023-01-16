-- CreateTable
CREATE TABLE "TimingPointAccessKey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "canAccessOthers" BOOLEAN NOT NULL,
    "token" TEXT NOT NULL,
    "timingPointId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimingPointAccessKey_timingPointId_fkey" FOREIGN KEY ("timingPointId") REFERENCES "TimingPoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimingPointAccessKey_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
