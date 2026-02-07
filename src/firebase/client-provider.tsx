'use client';

import React, { useEffect, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseInstance, setFirebaseInstance] = useState<any>(null);

  useEffect(() => {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app);
    const auth = getAuth(app);
    setFirebaseInstance({ app, db, auth });
  }, []);

  if (!firebaseInstance) return null;

  return (
    <FirebaseProvider
      firebaseApp={firebaseInstance.app}
      firestore={firebaseInstance.db}
      auth={firebaseInstance.auth}
    >
      {children}
    </FirebaseProvider>
  );
};
