/*
  Warnings:

  - You are about to drop the `MatchScore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "MatchScore_matchId_playerId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MatchScore";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MatchSystem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "totalMatches" INTEGER NOT NULL,
    "singlesCount" INTEGER NOT NULL,
    "doublesCount" INTEGER NOT NULL,
    "matchOrder" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IndividualMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "matchOrder" INTEGER NOT NULL,
    "playerId" TEXT NOT NULL,
    "opponentId" TEXT NOT NULL,
    "playerScore" INTEGER,
    "opponentScore" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "IndividualMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IndividualMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IndividualMatch_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DoublesMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "matchOrder" INTEGER NOT NULL,
    "homePlayer1Id" TEXT NOT NULL,
    "homePlayer2Id" TEXT NOT NULL,
    "awayPlayer1Id" TEXT NOT NULL,
    "awayPlayer2Id" TEXT NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DoublesMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_homePlayer1Id_fkey" FOREIGN KEY ("homePlayer1Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_homePlayer2Id_fkey" FOREIGN KEY ("homePlayer2Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_awayPlayer1Id_fkey" FOREIGN KEY ("awayPlayer1Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_awayPlayer2Id_fkey" FOREIGN KEY ("awayPlayer2Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Set" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "individualMatchId" TEXT,
    "doublesMatchId" TEXT,
    "setNumber" INTEGER NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Set_individualMatchId_fkey" FOREIGN KEY ("individualMatchId") REFERENCES "IndividualMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Set_doublesMatchId_fkey" FOREIGN KEY ("doublesMatchId") REFERENCES "DoublesMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_League" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "genderId" TEXT NOT NULL,
    "leagueTypeId" TEXT NOT NULL,
    "matchSystemId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "League_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "League_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "League_leagueTypeId_fkey" FOREIGN KEY ("leagueTypeId") REFERENCES "LeagueType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "League_matchSystemId_fkey" FOREIGN KEY ("matchSystemId") REFERENCES "MatchSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_League" ("createdAt", "genderId", "id", "leagueTypeId", "name", "seasonId", "updatedAt") SELECT "createdAt", "genderId", "id", "leagueTypeId", "name", "seasonId", "updatedAt" FROM "League";
DROP TABLE "League";
ALTER TABLE "new_League" RENAME TO "League";
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stageId" TEXT NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "matchSystemId" TEXT,
    "matchDate" DATETIME NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Match_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_matchSystemId_fkey" FOREIGN KEY ("matchSystemId") REFERENCES "MatchSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("awayTeamId", "createdAt", "homeTeamId", "id", "location", "matchDate", "stageId", "status", "updatedAt") SELECT "awayTeamId", "createdAt", "homeTeamId", "id", "location", "matchDate", "stageId", "status", "updatedAt" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_SubLeague" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "parentId" TEXT,
    "matchSystemId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SubLeague_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubLeague_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SubLeague" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SubLeague_matchSystemId_fkey" FOREIGN KEY ("matchSystemId") REFERENCES "MatchSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SubLeague" ("createdAt", "id", "leagueId", "name", "updatedAt") SELECT "createdAt", "id", "leagueId", "name", "updatedAt" FROM "SubLeague";
DROP TABLE "SubLeague";
ALTER TABLE "new_SubLeague" RENAME TO "SubLeague";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
