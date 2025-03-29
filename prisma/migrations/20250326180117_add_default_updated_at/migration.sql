-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Club" ("address", "createdAt", "email", "id", "logo", "name", "phone", "updatedAt", "website") SELECT "address", "createdAt", "email", "id", "logo", "name", "phone", "updatedAt", "website" FROM "Club";
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
CREATE TABLE "new_DoublesMatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "matchOrder" INTEGER NOT NULL,
    "homePlayer1Id" INTEGER NOT NULL,
    "homePlayer2Id" INTEGER NOT NULL,
    "awayPlayer1Id" INTEGER NOT NULL,
    "awayPlayer2Id" INTEGER NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DoublesMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_homePlayer1Id_fkey" FOREIGN KEY ("homePlayer1Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_homePlayer2Id_fkey" FOREIGN KEY ("homePlayer2Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_awayPlayer1Id_fkey" FOREIGN KEY ("awayPlayer1Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_awayPlayer2Id_fkey" FOREIGN KEY ("awayPlayer2Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DoublesMatch" ("awayPlayer1Id", "awayPlayer2Id", "awayScore", "createdAt", "homePlayer1Id", "homePlayer2Id", "homeScore", "id", "matchId", "matchOrder", "status", "updatedAt") SELECT "awayPlayer1Id", "awayPlayer2Id", "awayScore", "createdAt", "homePlayer1Id", "homePlayer2Id", "homeScore", "id", "matchId", "matchOrder", "status", "updatedAt" FROM "DoublesMatch";
DROP TABLE "DoublesMatch";
ALTER TABLE "new_DoublesMatch" RENAME TO "DoublesMatch";
CREATE TABLE "new_IndividualMatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchId" INTEGER NOT NULL,
    "matchOrder" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "playerScore" INTEGER,
    "opponentScore" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IndividualMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IndividualMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IndividualMatch_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IndividualMatch" ("createdAt", "id", "matchId", "matchOrder", "opponentId", "opponentScore", "playerId", "playerScore", "status", "updatedAt") SELECT "createdAt", "id", "matchId", "matchOrder", "opponentId", "opponentScore", "playerId", "playerScore", "status", "updatedAt" FROM "IndividualMatch";
DROP TABLE "IndividualMatch";
ALTER TABLE "new_IndividualMatch" RENAME TO "IndividualMatch";
CREATE TABLE "new_League" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "genderId" INTEGER NOT NULL,
    "leagueTypeId" INTEGER NOT NULL,
    "matchSystemId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "League_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "League_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "League_leagueTypeId_fkey" FOREIGN KEY ("leagueTypeId") REFERENCES "LeagueType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "League_matchSystemId_fkey" FOREIGN KEY ("matchSystemId") REFERENCES "MatchSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_League" ("createdAt", "genderId", "id", "leagueTypeId", "matchSystemId", "name", "seasonId", "updatedAt") SELECT "createdAt", "genderId", "id", "leagueTypeId", "matchSystemId", "name", "seasonId", "updatedAt" FROM "League";
DROP TABLE "League";
ALTER TABLE "new_League" RENAME TO "League";
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stageId" INTEGER NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "matchSystemId" INTEGER,
    "matchDate" DATETIME NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Match_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_matchSystemId_fkey" FOREIGN KEY ("matchSystemId") REFERENCES "MatchSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("awayScore", "awayTeamId", "createdAt", "homeScore", "homeTeamId", "id", "location", "matchDate", "matchSystemId", "stageId", "status", "updatedAt") SELECT "awayScore", "awayTeamId", "createdAt", "homeScore", "homeTeamId", "id", "location", "matchDate", "matchSystemId", "stageId", "status", "updatedAt" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_MatchSystem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "totalMatches" INTEGER NOT NULL,
    "singlesCount" INTEGER NOT NULL,
    "doublesCount" INTEGER NOT NULL,
    "matchOrder" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_MatchSystem" ("createdAt", "description", "doublesCount", "id", "matchOrder", "name", "singlesCount", "totalMatches", "type", "updatedAt") SELECT "createdAt", "description", "doublesCount", "id", "matchOrder", "name", "singlesCount", "totalMatches", "type", "updatedAt" FROM "MatchSystem";
DROP TABLE "MatchSystem";
ALTER TABLE "new_MatchSystem" RENAME TO "MatchSystem";
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATETIME,
    "gender" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "photo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Player" ("birthDate", "createdAt", "firstName", "gender", "id", "lastName", "licenseNumber", "photo", "updatedAt") SELECT "birthDate", "createdAt", "firstName", "gender", "id", "lastName", "licenseNumber", "photo", "updatedAt" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE TABLE "new_Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Season" ("createdAt", "endDate", "id", "isActive", "name", "startDate", "updatedAt") SELECT "createdAt", "endDate", "id", "isActive", "name", "startDate", "updatedAt" FROM "Season";
DROP TABLE "Season";
ALTER TABLE "new_Season" RENAME TO "Season";
CREATE TABLE "new_Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "individualMatchId" INTEGER,
    "doublesMatchId" INTEGER,
    "setNumber" INTEGER NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Set_individualMatchId_fkey" FOREIGN KEY ("individualMatchId") REFERENCES "IndividualMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Set_doublesMatchId_fkey" FOREIGN KEY ("doublesMatchId") REFERENCES "DoublesMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Set" ("awayScore", "createdAt", "doublesMatchId", "homeScore", "id", "individualMatchId", "setNumber", "updatedAt") SELECT "awayScore", "createdAt", "doublesMatchId", "homeScore", "id", "individualMatchId", "setNumber", "updatedAt" FROM "Set";
DROP TABLE "Set";
ALTER TABLE "new_Set" RENAME TO "Set";
CREATE TABLE "new_Stage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "leagueId" INTEGER,
    "subLeagueId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Stage_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Stage_subLeagueId_fkey" FOREIGN KEY ("subLeagueId") REFERENCES "SubLeague" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Stage" ("createdAt", "endDate", "id", "leagueId", "name", "order", "startDate", "subLeagueId", "updatedAt") SELECT "createdAt", "endDate", "id", "leagueId", "name", "order", "startDate", "subLeagueId", "updatedAt" FROM "Stage";
DROP TABLE "Stage";
ALTER TABLE "new_Stage" RENAME TO "Stage";
CREATE TABLE "new_SubLeague" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "matchSystemId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SubLeague_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubLeague_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SubLeague" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SubLeague_matchSystemId_fkey" FOREIGN KEY ("matchSystemId") REFERENCES "MatchSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SubLeague" ("createdAt", "id", "leagueId", "matchSystemId", "name", "parentId", "updatedAt") SELECT "createdAt", "id", "leagueId", "matchSystemId", "name", "parentId", "updatedAt" FROM "SubLeague";
DROP TABLE "SubLeague";
ALTER TABLE "new_SubLeague" RENAME TO "SubLeague";
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL,
    "leagueId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Team_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Team_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("clubId", "createdAt", "id", "leagueId", "name", "updatedAt") SELECT "clubId", "createdAt", "id", "leagueId", "name", "updatedAt" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
