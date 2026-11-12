import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  Firestore 
} from 'firebase/firestore';

// Connected Firebase Project: boon-hybrid-ai (921368184160)
const defaultFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "***REMOVED***",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "boon-hybrid-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "boon-hybrid-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "boon-hybrid-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "921368184160",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:921368184160:web:078448a342d752dc9fca05",
  measurementId: "G-Y52N2R51X6"
};

export function getStoredConfig() {
  try {
    const saved = localStorage.getItem('boon_firebase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not read stored firebase config", e);
  }
  return defaultFirebaseConfig;
}

export function saveStoredConfig(config: typeof defaultFirebaseConfig) {
  localStorage.setItem('boon_firebase_config', JSON.stringify(config));
}

let app: FirebaseApp;
let db: Firestore;

export function initFirebase() {
  const config = getStoredConfig();
  if (!getApps().length) {
    app = initializeApp(config);
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } catch {
      db = getFirestore(app);
    }
  } else {
    app = getApp();
    db = getFirestore(app);
  }
  return { app, db };
}

export { app, db };
