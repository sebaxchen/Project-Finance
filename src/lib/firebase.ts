// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBw9UZyZw02mqG8dX6lxG92pcuqsWTx_eY',
  authDomain: 'homecredit-1bac5.firebaseapp.com',
  projectId: 'homecredit-1bac5',
  storageBucket: 'homecredit-1bac5.firebasestorage.app',
  messagingSenderId: '963462956758',
  appId: '1:963462956758:web:deed9d5eba44bf3debab77',
  measurementId: 'G-7W678CJF14',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export { app, analytics };

