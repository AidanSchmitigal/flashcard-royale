import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export async function fetchUserDecks(userId: string) {
	const decksRef = collection(db, 'decks');
	const q = query(decksRef, where('ownersIds', 'array-contains', userId));
	const snapshot = await getDocs(q);

	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
