// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWsSIdzGmtvnNCdmMB59A5fgyBiSFFzDI",
  authDomain: "dmre-clinica-a7f55.firebaseapp.com",
  projectId: "dmre-clinica-a7f55",
  storageBucket: "dmre-clinica-a7f55.firebasestorage.app",
  messagingSenderId: "92244135899",
  appId: "1:92244135899:web:18e299b7406e6119c421fe",
  measurementId: "G-CKXDBTZBZ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
export const secondaryAuth = getAuth(initializeApp(firebaseConfig, "Secondary"));