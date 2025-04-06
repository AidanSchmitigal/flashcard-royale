export type Card = {
	id: string;
	term: string;
	definition: string;
	hp: number;
	damage: number;
};

export function createCardFromFlashcard(term: string, definition: string, health: number, damage: number): Card {
	return {
		id: crypto.randomUUID(),
		term,
		definition,
		hp: health,
		damage: damage
	};
}

// define deck
export type Deck = {
	id: string;
	name: string;
	ownerId: string;
	cards: Card[];
};

// defing GameHistory like addGameHistory({ deckId, moves: battle.playerHistory, time: new Date() });
export type GameHistory = {
	id: string;
	deckId: string;
	ownerId: string;
	createdAt: Date;
	won: boolean;
	moves: boolean[];
	time: Date;
};


