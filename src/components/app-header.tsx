'use client';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Logo from '@/components/logo';
import DailyEntryForm from '@/components/daily-entry-form';
import { useState } from 'react';

export default function AppHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-8">
      <Logo />
      <div className="ml-auto flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Entry
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <DailyEntryForm setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
