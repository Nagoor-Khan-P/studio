'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ProfileForm from '@/components/profile-form';

type UserInfo = {
  name: string | null;
  email: string;
};

export default function ProfileSheet({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserInfo;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent>
        <ProfileForm user={user} onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
