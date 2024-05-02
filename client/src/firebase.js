// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-app-5cc38.firebaseapp.com",
  projectId: "mern-blog-app-5cc38",
  storageBucket: "mern-blog-app-5cc38.appspot.com",
  messagingSenderId: "346218628761",
  appId: "1:346218628761:web:723060a604de83b35cda08"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

