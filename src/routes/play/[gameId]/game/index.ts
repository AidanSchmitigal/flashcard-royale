export enum GameState {
	Loading,
	HandSetup,
	Battle,
	EndScreen
}

export enum GameOutcome {
	Win,
	Loss,
	Draw
}

export type Card = {
	id: string;
	term: string;
	definition: string;
	base_health: number;
	base_dmg: number;
};

export type PowerUp = {
	id: string;
	name: string;
	description: string;
	cost: number;
	effect: (card: Card) => Card;
	icon: string;
};

// define deck
export type Deck = {
	id: string;
	title: string;
	cardCount: number;
	cards: Card[];
	createdAt: Date;
	createdBy: string;
};

export type Hand = {
	id: string;
	cards: Card[];
};

// // defing GameHistory like addGameHistory({ deckId, moves: battle.playerHistory, time: new Date() });
// export type GameHistory = {
// 	id: string;
// 	deckId: string;
// 	ownerId: string;
// 	createdAt: Date;
// 	won: boolean;
// 	moves: boolean[];
// 	time: Date;
// };

export type GameStats = {
	turns: number;
	player1Won: boolean;
	playerDeckId: string;
	PlayerAnswerHistory: boolean[];
	PlayerHandHistory: Hand[];
};

export type Game = {
	id: string;
	deck: Deck;
	createdAt: Date;
	createdBy: string | null;
	player1: string | null;
	player2: string | null;
	gameState: GameState;
	player1Hand: Hand | null;
	player2Hand: Hand | null;
	roundHistory: GameOutcome[]; // player1 outcomes
	roundNumber: number;
};
