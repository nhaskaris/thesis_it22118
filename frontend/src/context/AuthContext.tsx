'use client';

import { useContext, createContext, useState, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter, usePathname  } from "next/navigation";
import Cookies from "js-cookie";

const setTokenCookie = (token: string) => {
  Cookies.set("token", token, {
    expires: 30,
    path: "/",
    sameSite: "lax",
  });
};

const clearTokenCookie = () => {
  Cookies.remove("token", { path: "/" });
};

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
  const pathname = usePathname();

  const googleSignIn = async() => {
    // FIX 1: Guard against null auth
    if (!auth) return; 

    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    // FIX 2: Guard against null auth
    if (auth) {
      await signOut(auth);
    }
    clearTokenCookie();
    window.location.reload();
  };

  useEffect(() => {
    // FIX 3: If auth is null (like during build), stop loading and return
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if(currentUser && !user) {
        setUser(currentUser);
        const token = await currentUser.getIdToken();
        if (!token) return;

        const role = (await currentUser.getIdTokenResult())?.claims.admin;
        setIsAdmin(!!role);

        clearTokenCookie();
        setTokenCookie(token);
      }
      setLoading(false);
    });

    const refreshToken = async () => {
      if (user) {
        const token = await user.getIdToken(true);
        setTokenCookie(token);
      }
    }

    const interval = setInterval(refreshToken, 10 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
    
  }, [router, user, pathname]);

  return (
    <AuthContext.Provider value={{ 
        user, 
        googleSignIn, 
        logOut, 
        // FIX 4: Optional chaining for photoURL
        photoUrl: auth?.currentUser?.photoURL || null, 
        loading, 
        isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};