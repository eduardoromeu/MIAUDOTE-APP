// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; //bd


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDNJwvyTNI6cjs9UxsMEGTIi5OgeRfx54",
  authDomain: "miaudote-a9379.firebaseapp.com",
  projectId: "miaudote-a9379",
  storageBucket: "miaudote-a9379.firebasestorage.app",
  messagingSenderId: "702289945083",
  appId: "1:702289945083:web:591896536ab177238fab5e",
  measurementId: "G-JBEDQPVBBP"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication 
export const auth = getAuth(app);

// Initialize Direstore e export
export const db = getFirestore(app);