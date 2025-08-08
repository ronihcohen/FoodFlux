/*
  Warnings:

  - You are about to drop the column `dateKey` on the `DailyGoal` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DailyGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goalCalories" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DailyGoal" ("createdAt", "goalCalories", "id", "updatedAt", "userId") SELECT "createdAt", "goalCalories", "id", "updatedAt", "userId" FROM "DailyGoal";
DROP TABLE "DailyGoal";
ALTER TABLE "new_DailyGoal" RENAME TO "DailyGoal";
CREATE UNIQUE INDEX "DailyGoal_userId_key" ON "DailyGoal"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
