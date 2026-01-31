'use client';

import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { logout } from '@/app/actions/logout';

type UserInfo = {
  name: string | null;
  email: string;
};

export default function ProfileForm({
  user,
  onClose,
}: {
  user: UserInfo;
  onClose: () => void;
}) {
  return (
    <>
      <SheetHeader className="pr-6">
        <SheetTitle>Profile</SheetTitle>
        <SheetDescription>
          Manage your account details
        </SheetDescription>
      </SheetHeader>

      <div className="py-6 pr-6 space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              {user.name ?? 'Trader'}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Logout */}
        <form action={logout}>
          <Button variant="destructive" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
    </>
  );
}
