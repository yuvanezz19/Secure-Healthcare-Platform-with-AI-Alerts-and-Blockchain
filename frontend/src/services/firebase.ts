/**
 * Firebase Client SDK Configuration & Service Abstraction
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForVortexaSustainHackathon",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vortexa-sustain.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vortexa-sustain",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vortexa-sustain.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:a1b2c3d4e5f6"
};

export const isFirebaseConfigured = () => {
  return Boolean(import.meta.env.VITE_FIREBASE_API_KEY);
};
