-- CreateTable
CREATE TABLE "SubLeague" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SubLeague_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SubLeagueTeams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SubLeagueTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "SubLeague" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SubLeagueTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "leagueId" TEXT,
    "subLeagueId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Stage_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Stage_subLeagueId_fkey" FOREIGN KEY ("subLeagueId") REFERENCES "SubLeague" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Stage" ("createdAt", "endDate", "id", "leagueId", "name", "order", "startDate", "updatedAt") SELECT "createdAt", "endDate", "id", "leagueId", "name", "order", "startDate", "updatedAt" FROM "Stage";
DROP TABLE "Stage";
ALTER TABLE "new_Stage" RENAME TO "Stage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_SubLeagueTeams_AB_unique" ON "_SubLeagueTeams"("A", "B");

-- CreateIndex
CREATE INDEX "_SubLeagueTeams_B_index" ON "_SubLeagueTeams"("B");
