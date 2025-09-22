// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";




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




// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);