'use client';

import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { logout } from '@/app/actions/logout';
import { useFormStatus } from 'react-dom';

type UserInfo = {
  name: string | null;
  email: string;
};

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="destructive"
      className="w-full"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Logging out...
        </span>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
}

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

        {/* Logout with loading state */}
        <form action={logout}>
          <LogoutButton />
        </form>
      </div>
    </>
  );
}
