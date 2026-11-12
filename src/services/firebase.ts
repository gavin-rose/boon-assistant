import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  Firestore 
} from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const defaultFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_VITE_FIREBASE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_VITE_FIREBASE_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_VITE_FIREBASE_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_VITE_FIREBASE_APP_ID",
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
      if (import.meta.env.DEV && import.meta.env.VITE_APPCHECK_DEBUG_TOKEN) {
        (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN;
      }
      const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
      if (recaptchaSiteKey) {
        initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
          isTokenAutoRefreshEnabled: true
        });
        console.log("Firebase App Check initialized");
      } else {
        console.warn("App Check not initialized: VITE_RECAPTCHA_SITE_KEY not set");
      }
    } catch (e) {
      console.warn("App Check initialization error:", e);
    }

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
