import { initializeApp } from 'firebase/app';
import {
	browserLocalPersistence,
	createUserWithEmailAndPassword,
	getAuth,
	setPersistence,
	signInWithEmailAndPassword,
	updateProfile
} from 'firebase/auth';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	QueryDocumentSnapshot,
	setDoc,
	updateDoc
} from 'firebase/firestore';
import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	Firestore,
	FirestoreDataConverter,
	WithFieldValue,
	PartialWithFieldValue,
	SnapshotOptions
} from 'firebase/firestore';
import { writable } from 'svelte/store';
import type { User, UserData } from './types';

const firebaseConfig = {
	apiKey: 'AIzaSyAusGwxakO9YGF1s411bjrtoHQGOL1029w',
	authDomain: 'quizlet-royale.firebaseapp.com',
	projectId: 'quizlet-royale',
	storageBucket: 'quizlet-royale.firebasestorage.app',
	messagingSenderId: '287942623688',
	appId: '1:287942623688:web:ba3196ca83012eaece40fd',
	measurementId: 'G-7VWZJW56J5'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const user = writable<User | null>(null);

setPersistence(auth, browserLocalPersistence);

function typedCollection<T>(firestore: Firestore, path: string): CollectionReference<T> {
	return collection(firestore, path).withConverter(converter<T>());
}

function typedDoc<T>(firestore: Firestore, path: string): DocumentReference<T> {
	return doc(firestore, path).withConverter(converter<T>());
}

export const converter = <T>(): FirestoreDataConverter<T> => ({
	toFirestore(modelObject: WithFieldValue<T> | PartialWithFieldValue<T>): DocumentData {
		return modelObject as DocumentData;
	},

	fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T {
		return snapshot.data(options) as T;
	}
});

export const collections = {
	users: typedCollection<User>(db, 'users')
};

export const docs = {
	user: (id: string) => typedDoc<User>(db, `users/${id}`)
};

export async function getById<T>(ref: DocumentReference<T>): Promise<T | null> {
	const snap = await getDoc(ref);
	return snap.exists() ? snap.data() : null;
}

export async function setById<T>(ref: DocumentReference<T>, data: T): Promise<void> {
	return await setDoc(ref, data);
}

export async function getAll<T>(col: CollectionReference<T>): Promise<T[]> {
	const snap = await getDocs(col);
	return snap.docs.map((doc) => doc.data());
}

export async function getUser(id: string): Promise<User | null> {
	const snap = await getDoc(docs.user(id));
	return snap.exists() ? snap.data() : null;
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
	await updateDoc(docs.user(id), data);
}
export async function createNewUser(email: string, password: string, name: string): Promise<void> {
	return createUserWithEmailAndPassword(auth, email, password).then(async (currentUser) => {
		await updateProfile(currentUser.user, {
			displayName: name
		});

		await setDoc(doc(db, 'users', currentUser.user.uid), {
			avatarColor: 'blue',
			badges: [],
			stats: {
				xp: 0,
				level: 1,
				gamesPlayed: 0,
				gamesWon: 0,
				gamesLost: 0,
				gamesDraw: 0
			}
		} as UserData);
	});
}

auth.onAuthStateChanged(async (new_user) => {
	if (!new_user) {
		user.set(null);
		return;
	}

	const ref = docs.user(new_user.uid);
	const snap = await getDoc(ref);

	const new_user_data = snap.exists()
		? {
				...new_user,
				...snap.data()
			}
		: null;
	console.log(new_user_data);

	user.set(new_user_data);
});

export function signOut() {
	return auth.signOut();
}
