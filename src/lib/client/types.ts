type BaseCollection = {
	id: string;
};

type User = BaseCollection & {
	name: string;
	email: string;
	gameIds: string[];
};

type Game = BaseCollection & {
	user1Id: string;
	user2Id: string;
	deckId: string;
};

type Deck = BaseCollection & {
	ownersIds: string[];
	cards: string[];
};

type QuizCard = {
	question: string;
	answer: string;
};

type Card = BaseCollection & {
	deckId: string;
	question: string;
	answer: string;
	baseHealth: number;
	baseDamage: number;
};
