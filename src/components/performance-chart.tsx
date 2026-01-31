'use client'

import type { Trade } from "@/lib/types";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

type Props = {
  trades: Trade[];
};

const chartConfig = {
  profit: {
    label: "Cumulative P/L",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function PerformanceChart({ trades }: Props) {
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let cumulativeProfit = 0;
  const chartData = sortedTrades.map(trade => {
    cumulativeProfit += trade.amount;
    return {
      date: new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      profit: cumulativeProfit,
    };
  });

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-profit)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--color-profit)" stopOpacity={0}/>
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
          tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, '')}
        />
        <ChartTooltip 
          cursor={{fill: "hsl(var(--muted))"}}
          content={<ChartTooltipContent 
            labelClassName="font-bold"
            indicator="dot"
          />}
        />
        <Area type="monotone" dataKey="profit" stroke="var(--color-profit)" fillOpacity={1} fill="url(#colorProfit)" />
      </AreaChart>
    </ChartContainer>
  );
}
