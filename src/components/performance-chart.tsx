'use client'

import { useMemo, useState } from "react";
import type { Trade } from "@/lib/types";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

type Props = {
  trades: Trade[];
};

type Range = "3M" | "6M" | "1Y" | "ALL";

const chartConfig = {
  profit: {
    label: "Cumulative P/L",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function PerformanceChart({ trades }: Props) {
  const [range, setRange] = useState<Range>("ALL");

  const chartData = useMemo(() => {
    if (!trades.length) return [];

    const now = new Date();

    const rangeMap: Record<Exclude<Range, "ALL">, number> = {
      "3M": 90,
      "6M": 180,
      "1Y": 365,
    };

    const filteredTrades =
      range === "ALL"
        ? trades
        : trades.filter(trade => {
            const tradeDate = new Date(trade.date);
            const fromDate = new Date(now);
            fromDate.setDate(fromDate.getDate() - rangeMap[range]);
            return tradeDate >= fromDate;
          });

    const sortedTrades = [...filteredTrades].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulativeProfit = 0;

    return sortedTrades.map(trade => {
      cumulativeProfit += trade.amount;
      return {
        date: new Date(trade.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        profit: cumulativeProfit,
      };
    });
  }, [trades, range]);

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
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

      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No trades in this period
          </div>
        ) : (
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-profit)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-profit)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                formatCurrency(value).replace(/\.00$/, "")
              }
            />

            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={
                <ChartTooltipContent
                  labelClassName="font-bold"
                  indicator="dot"
                />
              }
            />

            <Area
              type="monotone"
              dataKey="profit"
              stroke="var(--color-profit)"
              fill="url(#colorProfit)"
              fillOpacity={1}
            />
          </AreaChart>
        )}
      </ChartContainer>
    </div>
  );
}
