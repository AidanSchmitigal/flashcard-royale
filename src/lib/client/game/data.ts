import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";

const games = collection(db, 'games');
const decks = collection(db, 'decks')

export async function createDeck(deck: Deck) {
    await setDoc(doc(decks, deck.id), deck)
}

export async function getDeck(ownerId: string): Promise<Deck[] | null> {
    try {
        const docs = (await getDocs(query(decks, where(ownerId, 'in', 'ownerIds')))).docs
        return docs.map((doc) => doc.data() as Deck)
    } catch {
        return null;
    }
}

export async function getGame(ownerId: string) {
}
