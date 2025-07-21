
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  updateUser: (updates: { displayName?: string, photoURL?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUser = (updates: { displayName?: string, photoURL?: string }) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      // This creates a new user object with the updates to trigger re-renders
      // In a real app, the `onAuthStateChanged` listener would handle this automatically
      // after a successful profile update with the backend.
      const updatedUser = { ...currentUser, ...updates };
      
      // The Firebase User object is not easily cloneable, we need to mock its methods
      return {
        ...updatedUser,
        getIdToken: () => currentUser.getIdToken(),
        getIdTokenResult: () => currentUser.getIdTokenResult(),
        reload: () => currentUser.reload(),
        toJSON: () => currentUser.toJSON(),
      } as User;
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
