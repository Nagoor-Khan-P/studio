'use client';

import { useFormState } from 'react-dom';
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { createTradeEntry, updateTradeEntry, type State } from '@/app/actions';
import { SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { SubmitButton } from './submit-button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from './ui/alert';
import type { Trade } from '@/lib/types';

export default function DailyEntryForm({
  setOpen,
  trade,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  trade?: Trade;
}) {
  const isEditMode = !!trade;
  const action = isEditMode ? updateTradeEntry : createTradeEntry;

  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useFormState(action, initialState);

  const formRef = useRef<HTMLFormElement>(null);

  const [date, setDate] = useState<Date>(
    trade ? new Date(trade.date) : new Date()
  );

  const { toast } = useToast();

  useEffect(() => {
    if (state.message?.includes('Successfully')) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state, setOpen, toast]);

  return (
    <>
      <SheetHeader className="pr-6">
        <SheetTitle>
          {isEditMode ? 'Edit Trade Entry' : 'Add a New Trade Entry'}
        </SheetTitle>
        <SheetDescription>
          {isEditMode
            ? 'Update the details for your trade entry.'
            : 'Enter the profit or loss for your trading day. Use a negative value for losses.'}
        </SheetDescription>
      </SheetHeader>

      <form ref={formRef} action={dispatch} className="py-4 pr-6">
        <div className="grid gap-4">
          {isEditMode && (
            <input type="hidden" name="id" value={trade.id} />
          )}

          {/* Amount */}
          <div className="grid gap-2">
            <Label htmlFor="amount">Profit / Loss</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="e.g., 150.75 or -50.25"
              required
              defaultValue={trade?.amount}
            />
            {state.errors?.amount && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.amount[0]}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>

            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="date"
                name="date"
                type="date"
                required
                value={format(date, 'yyyy-MM-dd')}
                onChange={(e) => {
                  if (e.target.value) {
                    setDate(new Date(e.target.value));
                  }
                }}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="pl-9"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Select the trade date (future dates not allowed)
            </p>

            {state.errors?.date && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.date[0]}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              className="min-h-[100px]"
              defaultValue={trade?.notes || ''}
            />
            {state.errors?.notes && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.notes[0]}
              </p>
            )}
          </div>

          {/* Error */}
          {state.message && !state.message.includes('Successfully') && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <SubmitButton>
              {isEditMode ? 'Update Entry' : 'Add Entry'}
            </SubmitButton>
          </div>
        </div>
      </form>
    </>
  );
}
