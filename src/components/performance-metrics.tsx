import type { Trade } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, DollarSign, Percent, CalendarDays, BarChart } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

type Props = {
  trades: Trade[];
};

export default function PerformanceMetrics({ trades }: Props) {
  const totalProfitLoss = trades.reduce((sum, trade) => sum + trade.amount, 0);
  const winningDays = trades.filter((trade) => trade.amount > 0);
  const losingDays = trades.filter((trade) => trade.amount < 0);
  const totalDays = trades.length;
  const winRate = totalDays > 0 ? (winningDays.length / totalDays) * 100 : 0;
  
  const averageWin = winningDays.length > 0 
    ? winningDays.reduce((sum, trade) => sum + trade.amount, 0) / winningDays.length 
    : 0;
  
  const averageLoss = losingDays.length > 0 
    ? losingDays.reduce((sum, trade) => sum + trade.amount, 0) / losingDays.length 
    : 0;

  const metrics = [
    {
      title: 'Total P/L',
      value: formatCurrency(totalProfitLoss),
      icon: DollarSign,
      color: totalProfitLoss >= 0 ? 'text-accent' : 'text-destructive',
    },
    {
      title: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: Percent,
    },
    {
      title: 'Total Days',
      value: totalDays,
      icon: CalendarDays,
    },
    {
      title: 'Winning Days',
      value: winningDays.length,
      icon: ArrowUp,
      color: 'text-accent',
    },
    {
      title: 'Losing Days',
      value: losingDays.length,
      icon: ArrowDown,
      color: 'text-destructive',
    },
    {
      title: 'Avg. Win',
      value: formatCurrency(averageWin),
      icon: BarChart,
      color: 'text-accent',
    },
     {
      title: 'Avg. Loss',
      value: formatCurrency(averageLoss),
      icon: BarChart,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={cn("h-4 w-4 text-muted-foreground", metric.color)} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", metric.color)}>{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
