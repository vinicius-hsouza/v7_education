import { createContext, useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut as signOutGoogle } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

import type { ReactNode } from 'react'

type User = {

  id: string | undefined
  name: string | null | undefined
  avatarUrl:string | null | undefined

}

type AuthData = {
  signIn: () => void
  signOut: () => void
  user: User
}

export const AuthContext = createContext({} as AuthData)

interface SearchContextProviderProps {
  children: ReactNode
}

const firebaseConfig = {
  apiKey: "AIzaSyCURovdfnaqJPB7UQIwm1VyTd7hDgMKjYA",
  authDomain: "my-cash-17e3d.firebaseapp.com",
  projectId: "my-cash-17e3d",
  storageBucket: "my-cash-17e3d.firebasestorage.app",
  messagingSenderId: "481149060330",
  appId: "1:481149060330:web:7fc322fbcb6274e3d88393",
  measurementId: "G-B0ED2D7FJ4"
};
export const appFirebase = initializeApp(firebaseConfig);
export const auth = getAuth(appFirebase);

export function AuthProvider({
  children,
}: SearchContextProviderProps) {
  const [user, setUser] = useState<User>({} as User);

 getAnalytics(appFirebase);

  async function signIn() {
    try {
      const provider = new GoogleAuthProvider();
      setPersistence(auth, browserLocalPersistence).then(async () => {
        const { user } = await signInWithPopup(auth, provider);

        console.log(user)

        setUser({ id: user?.uid, name: user?.displayName, avatarUrl: user.photoURL })
      }).catch(console.error)


    } catch (error) {
      console.error(error)
    }
  }

  async function signOut() {
    try {
      await signOutGoogle(auth)
      setUser({} as User)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ id: user?.uid, name: user?.displayName, avatarUrl: null })
      } else {
        console.error('user not logged')
      }
    });

  }, [])

  return (
    <AuthContext.Provider value={{ signIn, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
