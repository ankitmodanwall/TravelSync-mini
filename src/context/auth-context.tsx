'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { useUser, useAuth as useFirebaseAuth, useFirestore } from '@/firebase';
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User as FirebaseUser,
} from 'firebase/auth';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, updateDoc } from 'firebase/firestore';

type User = {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateUserProfile: (data: { name?: string; photoURL?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: firebaseUser, isUserLoading } = useUser();
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);

  const syncUserProfile = useCallback(
    (fbUser: FirebaseUser) => {
      if (firestore && fbUser) {
        const userRef = doc(firestore, 'userProfiles', fbUser.uid);
        // This is a non-blocking write. It will optimistically update the local cache
        // and sync with the server in the background. Errors are handled globally.
        setDocumentNonBlocking(
          userRef,
          {
            id: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          },
          { merge: true }
        );

        setUser({
          uid: fbUser.uid,
          name: fbUser.displayName,
          email: fbUser.email,
          photoURL: fbUser.photoURL,
        });
      }
    },
    [firestore]
  );

  useEffect(() => {
    if (firebaseUser) {
      syncUserProfile(firebaseUser);
    } else {
      setUser(null);
    }
  }, [firebaseUser, syncUserProfile]);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(error => {
      if (
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/popup-closed-by-user'
      ) {
        return;
      }
      console.error('Google sign-in error', error);
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        // The onAuthStateChanged listener will handle the user state update,
        // but we can immediately sync the profile to ensure data consistency.
        syncUserProfile(userCredential.user);
      }
    } catch (error) {
      throw error;
    }
  };
  
  const updateUserProfile = async (data: { name?: string; photoURL?: string }) => {
    if (!auth.currentUser || !firestore) {
      throw new Error("User not authenticated or Firestore not available.");
    }
    
    const updateData: { displayName?: string; photoURL?: string } = {};
    if (data.name) updateData.displayName = data.name;
    if (data.photoURL) updateData.photoURL = data.photoURL;

    // 1. Update Firebase Auth profile
    await updateProfile(auth.currentUser, updateData);

    // 2. Update Firestore userProfile document
    const userRef = doc(firestore, 'userProfiles', auth.currentUser.uid);
    // Here we use a standard awaited updateDoc because we want to ensure
    // the operation completes before giving feedback to the user.
    await updateDoc(userRef, updateData);
    
    // 3. Manually update local state to reflect changes immediately
    setUser(prevUser => prevUser ? {
      ...prevUser,
      name: data.name ?? prevUser.name,
      photoURL: data.photoURL ?? prevUser.photoURL,
    } : null);
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isUserLoading,
        login,
        loginWithGoogle,
        logout,
        signup,
        updateUserProfile,
      }}
    >
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
