-- CreateTable
CREATE TABLE "AgeCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "classificationId" INTEGER NOT NULL,
    CONSTRAINT "AgeCategory_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "Classification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
