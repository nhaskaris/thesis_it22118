'use client';

import { useContext, createContext, useState, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  User,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { setCookie, destroyCookie } from 'nookies'

interface MyComponentProps {
    children: React.ReactNode;
}

const AuthContext = createContext(
    {} as {
        user: User | null;
        loading: boolean;
        googleSignIn: () => void;
        logOut: () => void;
        photoUrl: string | null;
        isAdmin: boolean;
    }
);

export const AuthContextProvider = ({ children }: MyComponentProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();

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

    router.push('/')
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!auth) {
        setUser(null);

        destroyCookie(null, 'token');

        router.push('/')
      } else {
        setUser(currentUser);

        let token = await currentUser?.getIdToken();

        const role = (await currentUser?.getIdTokenResult())?.claims.admin;

        setIsAdmin(!!role);

        token = token ? token : '';

        setCookie(null, 'token', token);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, user]);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut, photoUrl: auth.currentUser!?.photoURL, loading, isAdmin}}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};