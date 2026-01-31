'use client';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PlusCircle, LogOut } from 'lucide-react';
import Logo from '@/components/logo';
import DailyEntryForm from '@/components/daily-entry-form';
import { useState } from 'react';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const { user, app } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    if (app) {
      const auth = getAuth(app);
      await signOut(auth);
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-8">
      <Logo />
      <div className="ml-auto flex items-center gap-2">
        {user && (
          <>
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
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="sr-only sm:not-sr-only">Sign Out</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
