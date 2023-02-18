import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "quanliluanvan.firebaseapp.com",
  projectId: "quanliluanvan",
  storageBucket: "quanliluanvan.appspot.com",
  messagingSenderId: "601918065674",
  appId: "1:601918065674:web:a5c8d4cd22ae70c55f63f3",
});

export const storage = getStorage(app);
