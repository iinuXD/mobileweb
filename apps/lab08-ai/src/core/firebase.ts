import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw_x58Y1fOoXN3bjQ9VxKXh5hGTmcUFbQ",
  authDomain: "mobileweb-17ab3.firebaseapp.com",
  projectId: "mobileweb-17ab3"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

