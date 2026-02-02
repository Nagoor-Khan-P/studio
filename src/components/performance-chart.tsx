'use client'

import { useMemo, useState } from "react";
import type { Trade } from "@/lib/types";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

type Props = {
  trades: Trade[];
};

type Range = "3M" | "6M" | "1Y" | "ALL";
type HammerView = "Daily" | "Monthly" | "Yearly";

const chartConfig = {
  profit: {
    label: "Cumulative P/L",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function PerformanceChart({ trades }: Props) {
  const [range, setRange] = useState<Range>("ALL");
  const [hammerView, setHammerView] = useState<HammerView>("Daily");

  /* -------------------- CUMULATIVE (FILTERED) -------------------- */
  const cumulativeData = useMemo(() => {
    if (!trades.length) return [];

    const now = new Date();
    const rangeMap = { "3M": 90, "6M": 180, "1Y": 365 } as const;

    const filtered =
      range === "ALL"
        ? trades
        : trades.filter(t => {
            const from = new Date(now);
            from.setDate(from.getDate() - rangeMap[range]);
            return new Date(t.date) >= from;
          });

    const sorted = [...filtered].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulative = 0;

    return sorted.map(t => {
      cumulative += t.amount;
      return {
        date: new Date(t.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        profit: cumulative,
      };
    });
  }, [trades, range]);

  /* -------------------- HAMMER (ALL DATA) -------------------- */
  const hammerData = useMemo(() => {
    if (!trades.length) return [];

    // -------- DAILY (Last 90 days) --------
    if (hammerView === "Daily") {
      const map = new Map<string, number>();

      trades.forEach(t => {
        const key = new Date(t.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        map.set(key, (map.get(key) ?? 0) + t.amount);
      });

      return Array.from(map.entries())
        .map(([date, value]) => ({ date, value }))
        .slice(-90);
    }

    // -------- MONTHLY --------
    if (hammerView === "Monthly") {
      const map = new Map<string, number>();

      trades.forEach(t => {
        const key = new Date(t.date).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        map.set(key, (map.get(key) ?? 0) + t.amount);
      });

      return Array.from(map.entries()).map(([date, value]) => ({
        date,
        value,
      }));
    }

    // -------- YEARLY --------
    const map = new Map<string, number>();

    trades.forEach(t => {
      const year = new Date(t.date).getFullYear().toString();
      map.set(year, (map.get(year) ?? 0) + t.amount);
    });

    return Array.from(map.entries()).map(([date, value]) => ({
      date,
      value,
    }));
  }, [trades, hammerView]);

  const largestLoss = Math.min(...hammerData.map(d => d.value), 0);

  return (
    <div className="space-y-8">
      {/* ---------------- Filters ---------------- */}
      <div className="flex justify-end gap-2">
        {(["3M", "6M", "1Y", "ALL"] as Range[]).map(r => (
          <Button
            key={r}
            size="sm"
            variant={range === r ? "default" : "outline"}
            onClick={() => setRange(r)}
          >
            {r}
          </Button>
        ))}
      </div>

      {/* ---------------- CUMULATIVE CHART ---------------- */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart data={cumulativeData} margin={{ left: -10, right: 20 }}>
          <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-profit)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-profit)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => formatCurrency(v)}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="var(--color-profit)"
            fill="url(#colorProfit)"
          />
        </AreaChart>
      </ChartContainer>

      {/* Separator */}
      <div className="my-6 border-t border-border" />

      {/* ---------------- HAMMER HEADER ---------------- */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          🔨 Daily Profit / Loss
        </h3>

        <div className="flex gap-2">
          {(["Daily", "Monthly", "Yearly"] as HammerView[]).map(v => (
            <Button
              key={v}
              size="sm"
              variant={hammerView === v ? "default" : "outline"}
              onClick={() => setHammerView(v)}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      {/* ---------------- HAMMER CHART ---------------- */}
      <ChartContainer config={chartConfig} className="h-[220px] w-full">
        <BarChart data={hammerData} margin={{ left: -10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => formatCurrency(v)}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />

          <Bar dataKey="value">
            {hammerData.map((d, i) => (
              <Cell
                key={i}
                fill={
                  d.value === largestLoss
                    ? "#991b1b" // darkest red → largest loss
                    : d.value >= 0
                    ? "#22c55e" // green
                    : "#ef4444" // red
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
