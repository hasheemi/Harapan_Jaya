// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDyhS4ksoXTLWchajwIAxc4li6-rWiAPJs",

//   authDomain: "transjatim2.firebaseapp.com",

//   projectId: "transjatim2",

//   storageBucket: "transjatim2.firebasestorage.app",

//   messagingSenderId: "150846087376",

//   appId: "1:150846087376:web:60e4ab17b0a989c3bbfed5",
// };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
