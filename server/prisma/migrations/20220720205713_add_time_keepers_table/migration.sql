-- CreateTable
CREATE TABLE "TimeKeeper" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "TimeKeeper_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeKeeper_raceId_name_key" ON "TimeKeeper"("raceId", "name");
