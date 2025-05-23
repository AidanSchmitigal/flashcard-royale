import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const users = collection(db, 'users');

export async function getName(id: string): Promise<string | null> {
	try {
		return (await getDoc(doc(users, id))).data()!['name'];
	} catch {
		return null;
	}
}
