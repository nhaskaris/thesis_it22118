'use client';

import { useContext, createContext, useState, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  Auth,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";

interface MyComponentProps {
    children: React.ReactNode;
}

const AuthContext = createContext(
    {} as {
        user: any;
        googleSignIn: () => void;
        logOut: () => void;
        photoUrl: string | null;
    }
);

export const AuthContextProvider = ({ children }: MyComponentProps) => {
  const [user, setUser] = useState(null);

  const googleSignIn = async() => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut, photoUrl: auth.currentUser!?.photoURL}}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};