import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { get, get_cards, parse_url } from "./request_quizlet";

const firebaseConfig = {
    apiKey: "AIzaSyAusGwxakO9YGF1s411bjrtoHQGOL1029w",
    authDomain: "quizlet-royale.firebaseapp.com",
    projectId: "quizlet-royale",
    storageBucket: "quizlet-royale.firebasestorage.app",
    messagingSenderId: "287942623688",
    appId: "1:287942623688:web:ba3196ca83012eaece40fd",
    measurementId: "G-7VWZJW56J5"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const parsed = parse_url('https://quizlet.com/255972996/history-flash-cards/')
get(parsed as string).then((got: any | null) => {
    const cards = get_cards(got as any)
    console.log(cards[0])
})
