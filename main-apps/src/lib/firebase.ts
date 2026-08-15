import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_Gsft5_n9KWDuf1v71vK7Y0ol6HOnCS0",
  authDomain: "orbitalguardian.firebaseapp.com",
  projectId: "orbitalguardian",
  storageBucket: "orbitalguardian.firebasestorage.app",
  messagingSenderId: "477249784493",
  appId: "1:477249784493:web:065b95162422b8933a9424",
  measurementId: "G-70W8B08093"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
