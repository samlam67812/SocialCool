// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCi1I3UhuW4sogNjrlnhzqppUZDMg-M1Pg",
  authDomain: "socialcool-50ddf.firebaseapp.com",
  projectId: "socialcool-50ddf",
  storageBucket: "socialcool-50ddf.appspot.com",
  messagingSenderId: "36503019694",
  appId: "1:36503019694:web:2b6787433daf565a798d3f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

export default { app, auth, db };
