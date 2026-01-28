import { createContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut as signOutGoogle,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import type { ReactNode } from "react";

/* =======================
   TYPES
======================= */
type User = {
  id?: string;
  name?: string | null;
  avatarUrl?: string | null;
};

type AuthData = {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext({} as AuthData);

interface AuthProviderProps {
  children: ReactNode;
}

/* =======================
   FIREBASE
======================= */
const firebaseConfig = {
  apiKey: "AIzaSyCURovdfnaqJPB7UQIwm1VyTd7hDgMKjYA",
  authDomain: "my-cash-17e3d.firebaseapp.com",
  projectId: "my-cash-17e3d",
  storageBucket: "my-cash-17e3d.firebasestorage.app",
  messagingSenderId: "481149060330",
  appId: "1:481149060330:web:7fc322fbcb6274e3d88393",
  measurementId: "G-B0ED2D7FJ4",
};

export const appFirebase = initializeApp(firebaseConfig);
export const auth = getAuth(appFirebase);

getAnalytics(appFirebase);

/* =======================
   PROVIDER
======================= */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const provider = new GoogleAuthProvider();

  /* =======================
     SIGN IN (PWA SAFE)
  ======================= */
  async function signIn() {
    try {
      await setPersistence(auth, browserLocalPersistence);

      const isPWA =
        window.matchMedia("(display-mode: standalone)").matches ||
        // iOS Safari
        (window.navigator as any).standalone === true;

      if (isPWA) {
        // ✅ PWA → redirect
        await signInWithRedirect(auth, provider);
      } else {
        // ✅ Desktop → popup
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error("Erro no signIn:", error);
    }
  }

  /* =======================
     SIGN OUT
  ======================= */
  async function signOut() {
    try {
      await signOutGoogle(auth);
      setUser(null);
    } catch (error) {
      console.error("Erro no signOut:", error);
    }
  }

  /* =======================
     HANDLE REDIRECT (PWA)
  ======================= */
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          const u = result.user;
          setUser({
            id: u.uid,
            name: u.displayName,
            avatarUrl: u.photoURL,
          });
        }
      })
      .catch(console.error);
  }, []);

  /* =======================
     AUTH STATE LISTENER
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
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
