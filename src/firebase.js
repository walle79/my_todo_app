// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8Npu_iDerdJYCTOWF7Z_69HGcIP8iC_w",
  authDomain: "todosapp-bb040.firebaseapp.com",
  projectId: "todosapp-bb040",
  storageBucket: "todosapp-bb040.firebasestorage.app",
  messagingSenderId: "178713092480",
  appId: "1:178713092480:web:2414098c9045c254c32165",
  measurementId: "G-B50QZ22BBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
