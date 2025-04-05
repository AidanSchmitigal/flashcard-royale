import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAusGwxakO9YGF1s411bjrtoHQGOL1029w",
    authDomain: "quizlet-royale.firebaseapp.com",
    projectId: "quizlet-royale",
    storageBucket: "quizlet-royale.firebasestorage.app",
    messagingSenderId: "287942623688",
    appId: "1:287942623688:web:ba3196ca83012eaece40fd",
    measurementId: "G-7VWZJW56J5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
