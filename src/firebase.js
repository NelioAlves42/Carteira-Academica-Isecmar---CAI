// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtTgzXrWaVejI_2DAkDXjETsRj-gAaG8M",
  authDomain: "carteiraisecmar.firebaseapp.com",
  projectId: "carteiraisecmar",
  storageBucket: "carteiraisecmar.appspot.com",
  messagingSenderId: "877074900711",
  appId: "1:877074900711:web:d89d1dac69354330b46442"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Realtime Database and get a reference to the service
export const db = getDatabase(app);
