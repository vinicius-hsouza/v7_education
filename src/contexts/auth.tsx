import { createContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut as signOutGoogle,
  onAuthStateChanged,
  getRedirectResult,
  indexedDBLocalPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import type { ReactNode } from "react";

/* =======================
   TYPES
======================= */
type User = {
  id?: string;
  name?: string | null;
  avatarUrl?: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

/* =======================
   FIREBASE CONFIG
======================= */
const firebaseConfig = {
  apiKey: "AIzaSyCURovdfnaqJPB7UQIwm1VyTd7hDgMKjYA",
  authDomain: "my-cash-17e3d.firebaseapp.com",
  projectId: "my-cash-17e3d",
  storageBucket: "my-cash-17e3d.firebasestorage.app",
  messagingSenderId: "481149060330",
  appId: "1:481149060330:web:7fc322fbcb6274e3d88393",
};

/* =======================
   HELPERS
======================= */
function isIOSPWA() {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone =
    (window.navigator as any).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;

  return isIOS && isStandalone;
}

/* =======================
   INIT FIREBASE
======================= */
export const appFirebase = initializeApp(firebaseConfig);

export const auth = initializeAuth(appFirebase, {
  persistence: isIOSPWA()
    ? inMemoryPersistence
    : indexedDBLocalPersistence,
});

/* =======================
   PROVIDER
======================= */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     LOGIN (REDIRECT)
  ======================= */
  async function signIn() {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }

  /* =======================
     LOGOUT
  ======================= */
  async function signOut() {
    await signOutGoogle(auth);
    setUser(null);
  }

  /* =======================
     HANDLE REDIRECT
  ======================= */
  useEffect(() => {
    getRedirectResult(auth).catch(() => { });
  }, []);

  /* =======================
     AUTH STATE (ÚNICA FONTE)
  ======================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          avatarUrl: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
