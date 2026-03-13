import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Using chorizomejor-app Firebase project (shared family project)
// Game data is namespaced via collection names (naw_games, game_requests)
const firebaseConfig = {
  apiKey: "AIzaSyDf1s-6iPaJ5GmZgTgPnwLJsvwAj_7tYmA",
  authDomain: "chorizomejor-app.firebaseapp.com",
  projectId: "chorizomejor-app",
  storageBucket: "chorizomejor-app.firebasestorage.app",
  messagingSenderId: "616108968942",
  appId: "1:616108968942:web:927666cffd3c0a15851cff"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
