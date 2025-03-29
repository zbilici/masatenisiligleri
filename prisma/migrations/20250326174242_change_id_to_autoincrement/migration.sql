/*
  Warnings:

  - The primary key for the `Club` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Club` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `DoublesMatch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `awayPlayer1Id` on the `DoublesMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `awayPlayer2Id` on the `DoublesMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `homePlayer1Id` on the `DoublesMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `homePlayer2Id` on the `DoublesMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `DoublesMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `matchId` on the `DoublesMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Gender` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Gender` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `IndividualMatch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `IndividualMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `matchId` on the `IndividualMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `opponentId` on the `IndividualMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `playerId` on the `IndividualMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `League` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `genderId` on the `League` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `League` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `leagueTypeId` on the `League` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `matchSystemId` on the `League` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `seasonId` on the `League` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `LeagueType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `LeagueType` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `awayTeamId` on the `Match` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `homeTeamId` on the `Match` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `Match` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `matchSystemId` on the `Match` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `stageId` on the `Match` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `MatchSystem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MatchSystem` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `PlayerTeam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `PlayerTeam` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `playerId` on the `PlayerTeam` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `seasonId` on the `PlayerTeam` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `teamId` on the `PlayerTeam` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Season` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Season` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Set` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `doublesMatchId` on the `Set` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `Set` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `individualMatchId` on the `Set` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Stage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Stage` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `leagueId` on the `Stage` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `subLeagueId` on the `Stage` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `SubLeague` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `SubLeague` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `leagueId` on the `SubLeague` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `matchSystemId` on the `SubLeague` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `parentId` on the `SubLeague` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `clubId` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `leagueId` on the `Team` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `A` on the `_SubLeagueTeams` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `B` on the `_SubLeagueTeams` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
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
    "updatedAt" DATETIME NOT NULL
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DoublesMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_homePlayer1Id_fkey" FOREIGN KEY ("homePlayer1Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_homePlayer2Id_fkey" FOREIGN KEY ("homePlayer2Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_awayPlayer1Id_fkey" FOREIGN KEY ("awayPlayer1Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DoublesMatch_awayPlayer2Id_fkey" FOREIGN KEY ("awayPlayer2Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DoublesMatch" ("awayPlayer1Id", "awayPlayer2Id", "awayScore", "createdAt", "homePlayer1Id", "homePlayer2Id", "homeScore", "id", "matchId", "matchOrder", "status", "updatedAt") SELECT "awayPlayer1Id", "awayPlayer2Id", "awayScore", "createdAt", "homePlayer1Id", "homePlayer2Id", "homeScore", "id", "matchId", "matchOrder", "status", "updatedAt" FROM "DoublesMatch";
DROP TABLE "DoublesMatch";
ALTER TABLE "new_DoublesMatch" RENAME TO "DoublesMatch";
CREATE TABLE "new_Gender" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Gender" ("id", "name") SELECT "id", "name" FROM "Gender";
DROP TABLE "Gender";
ALTER TABLE "new_Gender" RENAME TO "Gender";
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
    "updatedAt" DATETIME NOT NULL,
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "League_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "League_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "League_leagueTypeId_fkey" FOREIGN KEY ("leagueTypeId") REFERENCES "LeagueType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "League_matchSystemId_fkey" FOREIGN KEY ("matchSystemId") REFERENCES "MatchSystem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_League" ("createdAt", "genderId", "id", "leagueTypeId", "matchSystemId", "name", "seasonId", "updatedAt") SELECT "createdAt", "genderId", "id", "leagueTypeId", "matchSystemId", "name", "seasonId", "updatedAt" FROM "League";
DROP TABLE "League";
ALTER TABLE "new_League" RENAME TO "League";
CREATE TABLE "new_LeagueType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL
);
INSERT INTO "new_LeagueType" ("id", "level", "name") SELECT "id", "level", "name" FROM "LeagueType";
DROP TABLE "LeagueType";
ALTER TABLE "new_LeagueType" RENAME TO "LeagueType";
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
    "updatedAt" DATETIME NOT NULL,
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
    "updatedAt" DATETIME NOT NULL
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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Player" ("birthDate", "createdAt", "firstName", "gender", "id", "lastName", "licenseNumber", "photo", "updatedAt") SELECT "birthDate", "createdAt", "firstName", "gender", "id", "lastName", "licenseNumber", "photo", "updatedAt" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE TABLE "new_PlayerTeam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "joinDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaveDate" DATETIME,
    CONSTRAINT "PlayerTeam_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerTeam_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerTeam" ("id", "joinDate", "leaveDate", "playerId", "seasonId", "teamId") SELECT "id", "joinDate", "leaveDate", "playerId", "seasonId", "teamId" FROM "PlayerTeam";
DROP TABLE "PlayerTeam";
ALTER TABLE "new_PlayerTeam" RENAME TO "PlayerTeam";
CREATE UNIQUE INDEX "PlayerTeam_playerId_teamId_seasonId_key" ON "PlayerTeam"("playerId", "teamId", "seasonId");
CREATE TABLE "new_Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
    "updatedAt" DATETIME NOT NULL,
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
    "updatedAt" DATETIME NOT NULL,
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
    "updatedAt" DATETIME NOT NULL,
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
    "updatedAt" DATETIME NOT NULL,
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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new__SubLeagueTeams" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SubLeagueTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "SubLeague" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SubLeagueTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__SubLeagueTeams" ("A", "B") SELECT "A", "B" FROM "_SubLeagueTeams";
DROP TABLE "_SubLeagueTeams";
ALTER TABLE "new__SubLeagueTeams" RENAME TO "_SubLeagueTeams";
CREATE UNIQUE INDEX "_SubLeagueTeams_AB_unique" ON "_SubLeagueTeams"("A", "B");
CREATE INDEX "_SubLeagueTeams_B_index" ON "_SubLeagueTeams"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
