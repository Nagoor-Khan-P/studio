import type { Trade } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";
import { formatCurrency, cn } from "@/lib/utils";

type Props = {
  trades: Trade[];
};

export default function RecentTrades({ trades }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.id}>
            <TableCell className="font-medium whitespace-nowrap">{format(new Date(trade.date), 'MMM d, yyyy')}</TableCell>
            <TableCell className="text-muted-foreground truncate max-w-xs">{trade.notes || '–'}</TableCell>
            <TableCell className={cn(
              "text-right font-semibold",
              trade.amount >= 0 ? 'text-green-600' : 'text-destructive'
            )}>
              {formatCurrency(trade.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
