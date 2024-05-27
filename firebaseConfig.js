// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALufDY22IhXQhN8zkSa632XLq08RP5fU8",
  authDomain: "nutrifit-final.firebaseapp.com",
  projectId: "nutrifit-final",
  storageBucket: "nutrifit-final.appspot.com",
  messagingSenderId: "893966245620",
  appId: "1:893966245620:web:aadfe6684e2eade45c88a1",
  measurementId: "G-9G3WPXSR06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);