
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, getAuth } from 'firebase/auth';
import { useAuth, useFirebaseApp } from '../provider';

export const useUser = () => {
  const authFromContext = useAuth();
  const app = useFirebaseApp();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let auth = authFromContext;
    if (!auth && app) {
      auth = getAuth(app);
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authFromContext, app]);

  return { user, loading, app, auth: authFromContext };
};
