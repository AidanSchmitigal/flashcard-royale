import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

const users = collection(db, 'users');

async function getName(id: string): Promise<string | null> {
    try {
        return (await getDoc(doc(users, id))).data()!['name']
    } catch {
        return null;
    }
}
