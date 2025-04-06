import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

const users = collection(db, 'users');

async function getName(id: string): Promise<string | null> {
    try {
        const res = query(users, where('id', '==', id))

        const doc = (await getDocs(res)).docs[0]
        return doc.data['name']
    } catch {
        return null;
    }
}
