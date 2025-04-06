import { browser } from '$app/environment';
import { initializeApp } from 'firebase/app';
import { getAuth, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { writable } from 'svelte/store';

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

if (browser) auth.onAuthStateChanged((new_user) => user.update(() => new_user));

export function signOut() {
	return auth.signOut();
}
