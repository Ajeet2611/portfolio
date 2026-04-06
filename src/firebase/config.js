// src/firebase/config.js
// ⚠️ Replace ALL values below with your actual Firebase project config
// Get these from: Firebase Console → Your Project → Project Settings → Your Apps

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOm45W3Vk18vdFyeR_H6ORd4Fty2NQr70",
  authDomain: "ajeet-portfolio.firebaseapp.com",
  projectId: "ajeet-portfolio",
  storageBucket: "ajeet-portfolio.firebasestorage.app",
  messagingSenderId: "95529039658",
  appId: "1:95529039658:web:3519c49b9a36d774475053",
  measurementId: "G-FLCZY2MSR9"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
