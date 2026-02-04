'use client';

import { useEffect, useState } from "react";
import type { Trade } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  ArrowDown,
  ArrowUp,
  IndianRupee,
  CalendarDays,
  BarChart,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

/* -------------------- Storage Keys -------------------- */
const STARTING_CAPITAL_KEY = "trade-diary-starting-capital";
const CAPITAL_TXN_KEY = "trade-diary-capital-transactions";

/* -------------------- Types -------------------- */
type CapitalTxn = {
  id: string;
  amount: number; // +deposit, -withdraw
};

type Props = {
  trades: Trade[];
};

/* -------------------- Component -------------------- */
export default function PerformanceMetrics({ trades }: Props) {
  const [startingCapital, setStartingCapital] = useState(0);
  const [capitalTxns, setCapitalTxns] = useState<CapitalTxn[]>([]);
  const [amountInput, setAmountInput] = useState("");
  const [open, setOpen] = useState(false);

  /* ---------- Load from localStorage ---------- */
  useEffect(() => {
    setStartingCapital(Number(localStorage.getItem(STARTING_CAPITAL_KEY)) || 0);
    setCapitalTxns(
      JSON.parse(localStorage.getItem(CAPITAL_TXN_KEY) || "[]")
    );
  }, []);

  /* ---------- Persist transactions ---------- */
  useEffect(() => {
    localStorage.setItem(
      CAPITAL_TXN_KEY,
      JSON.stringify(capitalTxns)
    );
  }, [capitalTxns]);

  /* ---------- Calculations ---------- */
  const totalPL = trades.reduce((sum, t) => sum + t.amount, 0);
  const netFunding = capitalTxns.reduce((sum, t) => sum + t.amount, 0);
  const currentCapital = startingCapital + netFunding + totalPL;

  const winningDays = trades.filter((t) => t.amount > 0);
  const losingDays = trades.filter((t) => t.amount < 0);

  const winRate =
    trades.length > 0
      ? (winningDays.length / trades.length) * 100
      : 0;

  const avgWin =
    winningDays.length > 0
      ? winningDays.reduce((s, t) => s + t.amount, 0) /
        winningDays.length
      : 0;

  const avgLoss =
    losingDays.length > 0
      ? losingDays.reduce((s, t) => s + t.amount, 0) /
        losingDays.length
      : 0;

  /* ---------- Actions ---------- */
  const addTransaction = (amount: number) => {
    if (!amount) return;

    setCapitalTxns((prev) => [
      ...prev,
      { id: crypto.randomUUID(), amount },
    ]);

    setAmountInput("");
    setOpen(false);
  };

  /* -------------------- Render -------------------- */
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* ================= PRIMARY METRICS ================= */}

      {/* -------- Capital (2 columns) -------- */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-medium">Capital</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="text-3xl font-bold">
            {formatCurrency(currentCapital)}
          </div>

          <p className="text-xs text-muted-foreground">
            Start {formatCurrency(startingCapital)} · Funding{" "}
            {formatCurrency(netFunding)} · P/L{" "}
            {formatCurrency(totalPL)}
          </p>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Manage Capital
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Capital</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  autoFocus
                />

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    disabled={!amountInput}
                    onClick={() =>
                      addTransaction(Number(amountInput))
                    }
                  >
                    Deposit
                  </Button>

                  <Button
                    className="flex-1"
                    variant="destructive"
                    disabled={!amountInput}
                    onClick={() =>
                      addTransaction(-Number(amountInput))
                    }
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* -------- Total P/L -------- */}
      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "text-2xl font-bold",
              totalPL >= 0 ? "text-accent" : "text-destructive"
            )}
          >
            {formatCurrency(totalPL)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From {trades.length} trading days
          </p>
        </CardContent>
      </Card>

      {/* ================= SECONDARY METRICS ================= */}

      <MetricCard
        title="Win Rate"
        value={`${winRate.toFixed(1)}%`}
        icon={BarChart}
      />
      <MetricCard
        title="Total Days"
        value={trades.length}
        icon={CalendarDays}
      />
      <MetricCard
        title="Winning Days"
        value={winningDays.length}
        icon={ArrowUp}
        color="text-accent"
      />
      <MetricCard
        title="Losing Days"
        value={losingDays.length}
        icon={ArrowDown}
        color="text-destructive"
      />
      <MetricCard
        title="Avg. Win"
        value={formatCurrency(avgWin)}
        icon={BarChart}
        color="text-accent"
      />
      <MetricCard
        title="Avg. Loss"
        value={formatCurrency(avgLoss)}
        icon={BarChart}
        color="text-destructive"
      />
    </div>
  );
}

/* -------------------- Reusable Metric Card -------------------- */
function MetricCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 text-muted-foreground", color)} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", color)}>{value}</div>
      </CardContent>
    </Card>
  );
}
