
'use client';

import React from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export const FirebaseClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { firebaseApp, auth, firestore } = initializeFirebase();
  
  return (
    <FirebaseProvider value={{ app: firebaseApp, auth, firestore }}>
      {children}
    </FirebaseProvider>
  );
};
