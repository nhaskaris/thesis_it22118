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
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    await signOut(auth);

    clearTokenCookie();

    window.location.reload();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!auth) {
        setUser(null);

        clearTokenCookie();
      } else if(currentUser && !user) {
        setUser(currentUser);

        let token = await currentUser?.getIdToken();

        if (!token) return;

        const role = (await currentUser?.getIdTokenResult())?.claims.admin;
        setIsAdmin(!!role);

        token = token ? token : '';

        clearTokenCookie();

        setTokenCookie(token);
      }

      setLoading(false);
    });

    //refresh token every 20 minutes
    const refreshToken = async () => {
      const token = await user?.getIdToken(true)!;

      setTokenCookie(token);
    }

    const interval = setInterval(refreshToken, 10 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
    
  }, [router, user, pathname]);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut, photoUrl: auth.currentUser!?.photoURL, loading, isAdmin}}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};