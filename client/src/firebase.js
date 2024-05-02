// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-359fd.firebaseapp.com",
  projectId: "mern-blog-359fd",
  storageBucket: "mern-blog-359fd.appspot.com",
  messagingSenderId: "711621920093",
  appId: "1:711621920093:web:6cccc58c26dd2f598bd4b4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);