"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword as firebaseSignIn, createUserWithEmailAndPassword, updateProfile as firebaseUpdateProfile, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'user' | 'admin';

interface UserData {
  uid: string;
  email: string;
  name: string;
  phoneNumber: string;
  address: string;
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phoneNumber?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const response = await fetch(`/api/user/profile?userId=${uid}`);

      if (response.ok) {
        const data = await response.json();
        // API returns data directly, not wrapped in userData
        if (data && !data.error) {
          // Ensure all required fields are present
          const userData: UserData = {
            uid: data.uid || uid,
            email: data.email || '',
            name: data.name || '',
            phoneNumber: data.phoneNumber || '',
            address: data.address || '',
            role: data.role || 'user',
          };
          setUserData(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Use client-side Firebase auth for immediate state update
    const userCredential = await firebaseSignIn(auth, email, password);
    const user = userCredential.user;

    // Get or create user document
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let userData;
    
    if (userDoc.exists()) {
      userData = userDoc.data() as UserData;
    } else {
      // Create user document
      userData = {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        phoneNumber: '',
        address: '',
        role: 'user',
      };
      await setDoc(doc(db, 'users', user.uid), userData);
    }

    // Use fetchUserData to ensure consistency with refresh behavior
    await fetchUserData(user.uid);
    // User state will be updated by onAuthStateChanged
  };

  const signUp = async (email: string, password: string, name: string, phoneNumber?: string) => {
    // Use client-side Firebase auth for immediate state update
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await firebaseUpdateProfile(user, { displayName: name });

    // Create user document
    const userData: UserData = {
      uid: user.uid,
      email: user.email || '',
      name: name,
      phoneNumber: phoneNumber || '',
      address: '',
      role: 'user',
    };
    await setDoc(doc(db, 'users', user.uid), userData);

    setUserData(userData);
    // User state will be updated by onAuthStateChanged
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserData(null);
    // User state will be updated by onAuthStateChanged
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.uid, ...data }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update profile');
    }

    setUserData(result.userData);
    
    // Update display name in auth if name changed
    if (data.name && user) {
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(user, { displayName: data.name });
    }
  };

  const refreshUserData = useCallback(async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  }, [user]);

  const isAdmin = userData?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      isAdmin,
      signIn, 
      signUp, 
      signOut, 
      updateUserData,
      refreshUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
