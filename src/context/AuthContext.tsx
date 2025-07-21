
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate checking auth state on component mount
    setLoading(false);
  }, []);

  const login = (email: string) => {
    setLoading(true);
    
    const userToLogin = Object.values(mockUsers).find(u => u.email === email);
    
    if (userToLogin) {
      setUser({
        uid: userToLogin.id,
        displayName: userToLogin.name,
        email: userToLogin.email,
        photoURL: userToLogin.avatar,
        getIdToken: async () => 'mock-token',
      });
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userToLogin.name}! (Simulated)`,
      });
      setLoading(false);
      return true;
    } else {
       toast({
        title: "Login Failed",
        description: "No user found with that email. (Simulated)",
        variant: "destructive"
      });
      setLoading(false);
      return false;
    }
  };

  const signup = (name: string, email: string) => {
    setLoading(true);
    // Simulate creating a new user and logging them in
    const newUserId = `user-${crypto.randomUUID()}`;
    const newUserProfile: UserProfile = {
      id: newUserId,
      name: name,
      email: email,
      avatar: 'https://placehold.co/100x100.png',
      bio: 'A new member of the VENDRA community!',
      isVerifiedSeller: false,
      rating: 0,
      properties: [],
    };
    mockUsers[newUserId] = newUserProfile;

    setUser({
      uid: newUserProfile.id,
      displayName: newUserProfile.name,
      email: newUserProfile.email,
      photoURL: newUserProfile.avatar,
      getIdToken: async () => 'mock-token',
    });
     toast({
        title: 'Account Created',
        description: "You've been successfully signed up. (Simulated)",
      });
    setLoading(false);
  };


  const logout = () => {
    setLoading(true);
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out. (Simulated)",
    });
    setLoading(false);
  };

  const updateUser = (updates: { displayName?: string, photoURL?: string }) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, ...updates };
      // Also update the mockUsers object so changes persist across "logins"
      if(mockUsers[currentUser.uid]) {
        mockUsers[currentUser.uid].name = updatedUser.displayName || mockUsers[currentUser.uid].name;
        mockUsers[currentUser.uid].avatar = updatedUser.photoURL || mockUsers[currentUser.uid].avatar;
      }
      return updatedUser;
    });
  };

  const value = { user, loading, login, logout, signup, updateUser };

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

    