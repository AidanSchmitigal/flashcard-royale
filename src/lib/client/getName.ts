import { getDoc, doc } from 'firebase/firestore';
import { db } from '$lib/client/firebase';

export async function getName(uid: string): Promise<string | null> {
	try {
		const docRef = doc(db, 'users', uid);
		const snapshot = await getDoc(docRef);
		if (snapshot.exists()) {
			return snapshot.data().name || null;
		}
		return null;
	} catch (err) {
		console.error('Error fetching name from Firestore:', err);
		return null;
	}
}
