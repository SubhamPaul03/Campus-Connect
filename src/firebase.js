import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAozwwj-Xi5MyoBZZodBTSYH5i2sVrKmMM",
  authDomain: "campus-connect-b5e17.firebaseapp.com",
  projectId: "campus-connect-b5e17",
  storageBucket: "campus-connect-b5e17.firebasestorage.app",
  messagingSenderId: "341855091877",
  appId: "1:341855091877:web:ea483fe308de144214e14c",
  measurementId: "G-RTBPH868CH"
};

const app = initializeApp(firebaseConfig);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);