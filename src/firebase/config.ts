
import { FirebaseOptions } from 'firebase/app';

// IMPORTANT: Replace this with your actual Firebase project configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export function getFirebaseConfig() {
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.warn('Firebase config is not set. Please update src/firebase/config.ts with your project configuration. Using placeholder values.');
  }
  return firebaseConfig;
}
