import type { Card } from './index';

export class BattleManager {
	playerQueue: Card[];
	enemyQueue: Card[];

	constructor(playerCards: Card[], enemyCards: Card[]) {
		this.playerQueue = [...playerCards];
		this.enemyQueue = [...enemyCards];
	}

	getCurrentAttacker(): Card {
		return this.playerQueue[0];
	}

	getCurrentDefender(): Card {
		return this.enemyQueue[0];
	}

	processTurn(correct: boolean): { log: string; done: boolean } {
		const attacker = this.playerQueue.shift()!;
		const defender = this.enemyQueue[0];

		if (correct) {
			defender.hp -= attacker.damage;
			if (defender.hp <= 0) {
				this.enemyQueue.shift(); // Remove defeated card
			}
		}

		// Always send attacker to back of queue
		this.playerQueue.push(attacker);

		const log = correct
			? `${attacker.term} hit for ${attacker.damage}`
			: `${attacker.term} missed!`;

		const done = this.enemyQueue.length === 0;

		return { log, done };
	}
}
