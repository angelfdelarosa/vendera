
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsers } from '@/lib/mock-data';
import type { UserProfile } from '@/types';

// Let's create a mock user type that is compatible with what the app expects
// It's a mix of Firebase's User and our UserProfile
type MockUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  // Add other methods/properties if needed by other parts of the app
  // For now, we'll keep it simple.
  getIdToken: () => Promise<string>;
};

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string) => void;
  updateUser: (updates: { displayName?: string, photoURL?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get a default user for the simulation
const defaultUser = Object.values(mockUsers)[3];
const simulatedUser: MockUser = {
  uid: defaultUser.id,
  displayName: defaultUser.name,
  email: defaultUser.email,
  photoURL: defaultUser.avatar,
  getIdToken: async () => 'mock-token',
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(simulatedUser);
  
  // All auth functions are now no-ops as we are always logged in.
  const login = (email: string) => true;
  const logout = () => {};
  const signup = (name: string, email: string) => {};
  
  const updateUser = (updates: { displayName?: string, photoURL?: string }) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, ...updates };
      // Also update the mockUsers object so changes persist
      if(mockUsers[currentUser.uid]) {
        mockUsers[currentUser.uid].name = updatedUser.displayName || mockUsers[currentUser.uid].name;
        mockUsers[currentUser.uid].avatar = updatedUser.photoURL || mockUsers[currentUser.uid].avatar;
      }
      return updatedUser;
    });
  };

  const value = { 
    user, 
    loading: false, // Never in loading state
    login, 
    logout, 
    signup, 
    updateUser 
  };

  return (
    <AuthContext.Provider value={value}>
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
