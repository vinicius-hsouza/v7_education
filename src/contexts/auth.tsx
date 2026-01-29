import { createContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import type { ReactNode } from "react";

/* =====================
   TYPES
===================== */
type User = {
  id: string;
  email: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

/* =====================
   FIREBASE CONFIG
===================== */
const firebaseConfig = {
  apiKey: "AIzaSyCURovdfnaqJPB7UQIwm1VyTd7hDgMKjYA",
  authDomain: "my-cash-17e3d.firebaseapp.com",
  projectId: "my-cash-17e3d",
  storageBucket: "my-cash-17e3d.firebasestorage.app",
  messagingSenderId: "481149060330",
  appId: "1:481149060330:web:7fc322fbcb6274e3d88393",
};

export const appFirebase = initializeApp(firebaseConfig);
export const auth = getAuth(appFirebase);

/* =====================
   PROVIDER
===================== */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function signOutUser() {
    await signOut(auth);
    setUser(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
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
      value={{ user, loading, signIn, signUp, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
