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
		hp: 100,
		damage: 30
	};
}
