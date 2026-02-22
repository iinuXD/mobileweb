import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw_x58Y1fOoXN3bjQ9VxKXh5hGTmcUFbQ",
  authDomain: "mobileweb-17ab3.firebaseapp.com",
  projectId: "mobileweb-17ab3",
  storageBucket: "mobileweb-17ab3.firebasestorage.app",
  messagingSenderId: "291967822295",
  appId: "1:291967822295:web:3ad8ff2a42480080aec392",
  measurementId: "G-0QPNSBD3KH"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);