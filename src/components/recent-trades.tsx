'use client';

import { useState } from 'react';
import type { Trade } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from './ui/button';
import { Pencil } from 'lucide-react';
import { Sheet, SheetContent } from './ui/sheet';
import DailyEntryForm from './daily-entry-form';

type Props = {
  trades: Trade[];
};

export default function RecentTrades({ trades }: Props) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | undefined>(undefined);

  const handleEditClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsSheetOpen(true);
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setSelectedTrade(undefined);
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[40px]"><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id} className="group">
              <TableCell className="font-medium whitespace-nowrap">{format(new Date(trade.date), 'MMM d, yyyy')}</TableCell>
              <TableCell className="text-muted-foreground truncate max-w-xs">{trade.notes || '–'}</TableCell>
              <TableCell className={cn(
                "text-right font-semibold",
                trade.amount >= 0 ? 'text-green-600' : 'text-destructive'
              )}>
                {formatCurrency(trade.amount)}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEditClick(trade)} className="opacity-0 group-hover:opacity-100">
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent>
          {selectedTrade && <DailyEntryForm setOpen={setIsSheetOpen} trade={selectedTrade} />}
        </SheetContent>
      </Sheet>
    </>
  );
}
