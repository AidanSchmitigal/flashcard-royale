import { addDoc, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
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

export async function getGames(deckId: string) {
    try {
        const docs = (await getDocs(query(games, where(deckId, '==', 'deckId')))).docs
        return docs.map((doc) => doc.data() as GameHistory)
    } catch {
        return null;
    }
}

export async function addGameHistory(history: GameHistory) {
    await addDoc(games, history)
}

// Should move file
export async function getCorrect(question: string, answer: string, user: string): Promise<boolean> {
    const resp = await fetch('/api/process_cards', {
        method: "POST",
        body: JSON.stringify({ question, answer, user }),
    })

    return (await resp.json()).is_correct
}
