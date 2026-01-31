'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import type { Trade } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Sheet, SheetContent } from './ui/sheet';
import DailyEntryForm from './daily-entry-form';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTradeEntry, type State } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from './submit-button';

type Props = {
  trades: Trade[];
};

function DeleteTradeForm({ tradeId }: { tradeId: string }) {
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useFormState(deleteTradeEntry, initialState);

  useEffect(() => {
    if (state.message?.includes('Successfully')) {
      toast({
        title: "Success!",
        description: state.message,
      });
      setIsAlertOpen(false);
    } else if (state.message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form action={dispatch}>
          <input type="hidden" name="id" value={tradeId} />
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this trade entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <SubmitButton variant="destructive">Delete</SubmitButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
            <TableHead className="w-[80px]"><span className="sr-only">Actions</span></TableHead>
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
                <div className="opacity-0 group-hover:opacity-100 flex items-center justify-end gap-0">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(trade)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <DeleteTradeForm tradeId={trade.id} />
                </div>
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
