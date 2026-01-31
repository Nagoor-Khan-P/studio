/*
  Warnings:

  - Added the required column `entryPrice` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exitPrice` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "entryPrice" REAL NOT NULL,
    "exitPrice" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "pnl" REAL NOT NULL,
    "tradeDate" DATETIME NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Trade" ("id", "notes", "pnl", "quantity", "symbol", "tradeDate", "userId") SELECT "id", "notes", "pnl", "quantity", "symbol", "tradeDate", "userId" FROM "Trade";
DROP TABLE "Trade";
ALTER TABLE "new_Trade" RENAME TO "Trade";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
