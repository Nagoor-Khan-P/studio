'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import DailyEntryForm from '@/components/daily-entry-form';

export default function AddEntrySheet({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent>
        <DailyEntryForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
