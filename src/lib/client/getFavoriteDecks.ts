// src/lib/client/getFavoriteDecks.ts
import { getDatabase, ref, get, child, query, orderByChild, limitToLast } from 'firebase/database';

export interface FavoriteDeck {
  title: string;
  playCount: number;
  deckId: string;
}

export async function fetchFavoriteDecks(userId: string, limit: number = 5): Promise<FavoriteDeck[]> {
  const db = getDatabase();

  // Assuming deck play counts are stored under something like:
  // /users/{userId}/deckStats/{deckId}: { title, playCount }
  const statsRef = ref(db, `users/${userId}/deckStats`);
  const snapshot = await get(statsRef);

  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  const decks: FavoriteDeck[] = Object.entries(data).map(([deckId, value]: [string, any]) => ({
    deckId,
    title: value.title ?? 'Untitled Deck',
    playCount: value.playCount ?? 0,
  }));

  // Sort descending by play count
  decks.sort((a, b) => b.playCount - a.playCount);

  return decks.slice(0, limit);
}
