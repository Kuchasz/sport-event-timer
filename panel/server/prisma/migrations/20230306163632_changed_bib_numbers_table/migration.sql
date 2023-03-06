/*
  Warnings:

  - You are about to drop the `BibNumbers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BibNumbers";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BibNumber" (
    "number" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,

    PRIMARY KEY ("raceId", "number"),
    CONSTRAINT "BibNumber_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
