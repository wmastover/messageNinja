import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

export const signUp = async (email: string, password: string): Promise<void> => {
  await createUserWithEmailAndPassword(auth, email, password);
}

export const signIn = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
}

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
}

export const observeUser = (onChange: (user: User | null) => void) => {
  return onAuthStateChanged(auth, onChange);
}
