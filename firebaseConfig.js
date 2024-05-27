// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics"; // Typically not used in Expo projects

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALufDY22IhXQhN8zkSa632XLq08RP5fU8",
  authDomain: "nutrifit-final.firebaseapp.com",
  databaseURL: "https://nutrifit-final-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nutrifit-final",
  storageBucket: "nutrifit-final.appspot.com",
  messagingSenderId: "893966245620",
  appId: "1:893966245620:web:aadfe6684e2eade45c88a1",
  measurementId: "G-9G3WPXSR06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
// const analytics = getAnalytics(app); // Analytics is typically not used in Expo projects

export { app, auth, database };
