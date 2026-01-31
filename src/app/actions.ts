'use server';

import { z } from 'zod';
import { addTrade, updateTrade, deleteTrade } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const TradeFormSchema = z.object({
  amount: z.coerce.number({invalid_type_error: "Please enter a valid amount."})
    .min(-1000000, 'Amount seems too low.')
    .max(1000000, 'Amount seems too high.'),
  date: z.coerce.date({invalid_type_error: "Please select a valid date."}),
  notes: z.string().max(280, 'Notes must be 280 characters or less.').optional(),
});

export type State = {
  errors?: {
    amount?: string[];
    date?: string[];
    notes?: string[];
  };
  message?: string | null;
};

export async function createTradeEntry(prevState: State, formData: FormData) {
  const validatedFields = TradeFormSchema.safeParse({
    amount: formData.get('amount'),
    date: formData.get('date'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create entry.',
    };
  }
  
  const { amount, date, notes } = validatedFields.data;

  try {
    await addTrade({ amount, date, notes });
  } catch (error) {
    return {
      message: 'Database Error: Failed to create entry.',
    };
  }

  revalidatePath('/dashboard');
  return { message: 'Successfully added entry.', errors: {} };
}

export async function updateTradeEntry(prevState: State, formData: FormData) {
  const id = formData.get('id');
  if (!id || typeof id !== 'string') {
    return { message: 'Invalid trade ID.', errors: {} };
  }
  
  const validatedFields = TradeFormSchema.safeParse({
    amount: formData.get('amount'),
    date: formData.get('date'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to update entry.',
    };
  }
  
  const { amount, date, notes } = validatedFields.data;

  try {
    await updateTrade(id, { amount, date, notes });
  } catch (error) {
    return {
      message: 'Database Error: Failed to update entry.',
    };
  }

  revalidatePath('/dashboard');
  return { message: 'Successfully updated entry.', errors: {} };
}

export async function deleteTradeEntry(prevState: State, formData: FormData): Promise<State> {
  const id = formData.get('id');

  if (!id || typeof id !== 'string') {
    return { message: 'Invalid trade ID.' };
  }
  
  try {
    await deleteTrade(id);
    revalidatePath('/dashboard');
    return { message: 'Successfully deleted entry.' };
  } catch (error) {
    const err = error as Error;
    return { message: err.message || 'Database Error: Failed to delete entry.' };
  }
}
