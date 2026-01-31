import type { Trade } from "./types";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

export async function getTrades(): Promise<Trade[]> {
  const userId = await getSessionUserId();
  if (!userId) return [];

  const trades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { tradeDate: "desc" },
  });

  return trades.map((t: (typeof trades)[number]) => ({
    id: t.id,
    date: t.tradeDate,
    amount: t.pnl,
    notes: t.notes ?? "",
  }));
}


/**
 * Add a new trade for the logged-in user
 */
export async function addTrade(
  trade: Omit<Trade, "id">
): Promise<Trade> {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const created = await prisma.trade.create({
    data: {
      userId,
      tradeDate: trade.date,
      pnl: trade.amount,
      notes: trade.notes,
      symbol: "N/A",       // can be improved later
      entryPrice: 0,
      exitPrice: 0,
      quantity: 1,
    },
  });

  return {
    id: created.id,
    date: created.tradeDate,
    amount: created.pnl,
    notes: created.notes ?? "",
  };
}

/**
 * Update an existing trade
 */
export async function updateTrade(
  id: string,
  trade: Omit<Trade, "id">
): Promise<Trade> {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const updated = await prisma.trade.update({
    where: {
      id,
      userId, // ensures user can only update own trades
    },
    data: {
      tradeDate: trade.date,
      pnl: trade.amount,
      notes: trade.notes,
    },
  });

  return {
    id: updated.id,
    date: updated.tradeDate,
    amount: updated.pnl,
    notes: updated.notes ?? "",
  };
}

/**
 * Delete a trade
 */
export async function deleteTrade(id: string): Promise<void> {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.trade.delete({
    where: {
      id,
      userId, // ensures user can only delete own trades
    },
  });
}
