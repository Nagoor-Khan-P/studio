'use client'

import { useFormState } from 'react-dom';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { createTradeEntry, updateTradeEntry, type State } from '@/app/actions';
import { SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { SubmitButton } from './submit-button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from './ui/alert';
import type { Trade } from '@/lib/types';

export default function DailyEntryForm({ setOpen, trade }: { setOpen: Dispatch<SetStateAction<boolean>>; trade?: Trade }) {
  const isEditMode = !!trade;
  const action = isEditMode ? updateTradeEntry : createTradeEntry;

  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date | undefined>(trade ? new Date(trade.date) : new Date());
  const { toast } = useToast();

  useEffect(() => {
    if (state.message?.includes('Successfully')) {
      toast({
        title: "Success!",
        description: state.message,
      });
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state, setOpen, toast]);
  
  return (
    <>
      <SheetHeader className="pr-6">
        <SheetTitle>{isEditMode ? 'Edit Trade Entry' : 'Add a New Trade Entry'}</SheetTitle>
        <SheetDescription>
          {isEditMode ? "Update the details for your trade entry." : "Enter the profit or loss for your trading day. Use a negative value for losses."}
        </SheetDescription>
      </SheetHeader>
      <form ref={formRef} action={dispatch} className="py-4 pr-6">
        <div className="grid gap-4">
          {isEditMode && <input type="hidden" name="id" value={trade.id} />}
          <div className="grid gap-2">
            <Label htmlFor="amount">Profit / Loss</Label>
            <Input id="amount" name="amount" type="number" step="0.01" placeholder="e.g., 150.75 or -50.25" required defaultValue={trade?.amount} />
            {state.errors?.amount && <p className="text-sm font-medium text-destructive">{state.errors.amount[0]}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="hidden" value={date ? format(date, 'yyyy-MM-dd') : ''} />
              <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {state.errors?.date && <p className="text-sm font-medium text-destructive">{state.errors.date[0]}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" name="notes" placeholder="Any thoughts on today's trading?" className="min-h-[100px]" defaultValue={trade?.notes || ''} />
              {state.errors?.notes && <p className="text-sm font-medium text-destructive">{state.errors.notes[0]}</p>}
          </div>
          {state.message && !state.message.includes('Successfully') && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <SubmitButton>{isEditMode ? 'Update Entry' : 'Add Entry'}</SubmitButton>
          </div>
        </div>
      </form>
    </>
  );
}
