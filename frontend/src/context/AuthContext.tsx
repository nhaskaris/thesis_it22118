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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const googleSignIn = async() => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    await signOut(auth);

    setIsLoggingOut(true);

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

        destroyCookie(null, 'token');

        setCookie(null, 'token', token);

        if (pathname === '/' && !isLoggingOut) {
          router.push('/projects');
        }
      }

      setLoading(false);
    });

    //refresh token every 20 minutes
    const refreshToken = async () => {
      const token = await user?.getIdToken(true)!;

      setCookie(null, 'token', token);
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