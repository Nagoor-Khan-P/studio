'use client';

import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import ProfileSheet from '@/components/profile-sheet';

type UserInfo = {
  name: string | null;
  email: string;
};

export default function AppHeader({
  user,
}: {
  user: UserInfo;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-8">
      <Logo href="/dashboard" />

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-foreground/80">
          Welcome back,&nbsp;
          <span className="font-semibold text-foreground">
            {user.name ?? 'Trader'}
          </span>
        </span>

        <ProfileSheet user={user}>
          <Button
            variant="ghost"
            className="
              h-9 w-9 rounded-full
              bg-primary/10 text-primary
              hover:bg-primary/20
              focus-visible:ring-2 focus-visible:ring-ring
            "
          >
            <User className="h-5 w-5" />
          </Button>
        </ProfileSheet>
      </div>
    </header>
  );
}
