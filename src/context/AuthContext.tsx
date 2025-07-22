
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
  signup: (name: string, email: string, pass: string) => Promise<any>;
  updateUser: (updates: { displayName?: string, photoURL?: string }) => Promise<void>;
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

  const signup = async (name: string, email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: `https://placehold.co/100x100.png`
    });
    // Add new user to mock data for profile page consistency
    mockUsers[userCredential.user.uid] = {
      id: userCredential.user.uid,
      name: name,
      email: email,
      avatar: `https://placehold.co/100x100.png`,
      bio: "Un nuevo miembro de la comunidad VENDRA.",
      isVerifiedSeller: false,
      rating: 0,
      properties: []
    }
    return userCredential;
  };
  
  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    return signOut(auth);
  };
  
  const updateUser = async (updates: { displayName?: string, photoURL?: string }) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, updates);
      // We need to trigger a re-render to see the changes
      setUser({ ...auth.currentUser });

      // Also update the mockUsers object so changes persist on profile page
      if(mockUsers[auth.currentUser.uid]) {
        mockUsers[auth.currentUser.uid].name = updates.displayName || mockUsers[auth.currentUser.uid].name;
        mockUsers[auth.currentUser.uid].avatar = updates.photoURL || mockUsers[auth.currentUser.uid].avatar;
      }
    }
  };


  const value = { 
    user, 
    loading, 
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
