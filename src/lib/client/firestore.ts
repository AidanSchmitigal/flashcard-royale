import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAusGwxakO9YGF1s411bjrtoHQGOL1029w',
	authDomain: 'quizlet-royale.firebaseapp.com',
	projectId: 'quizlet-royale',
	storageBucket: 'quizlet-royale.firebasestorage.app',
	messagingSenderId: '287942623688',
	appId: '1:287942623688:web:ba3196ca83012eaece40fd',
	measurementId: 'G-7VWZJW56J5'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
async function getCities(db) {
	const citiesCol = collection(db, 'cities');
	const citySnapshot = await getDocs(citiesCol);
	const cityList = citySnapshot.docs.map((doc) => doc.data());
	return cityList;
}
