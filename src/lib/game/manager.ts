import type { Card } from './index';

export class BattleManager {
	playerQueue: Card[];
	enemyQueue: Card[];
	correctlyAnsweredCardIds: Set<string | number>;

	constructor(playerCards: Card[], enemyCards: Card[]) {
		this.playerQueue = [...playerCards];
		this.enemyQueue = [...enemyCards];
		this.correctlyAnsweredCardIds = new Set();
	}

	getCurrentAttacker(): Card {
		return this.playerQueue[0];
	}

	getCurrentDefender(): Card {
		return this.enemyQueue[0];
	}

	getPlayerCards() {
		return [...this.playerQueue]; // Return a copy of the array
	}

	getEnemyCards() {
		return [...this.enemyQueue]; // Return a copy of the array
	}
	
	isCardAnsweredCorrectly(cardId: string | number): boolean {
		return this.correctlyAnsweredCardIds.has(cardId);
	}

	processTurn(correct: boolean): { log: string; done: boolean; targetId: number | null; needNewPrompt: boolean; playerTookDamage: boolean; playerDamageAmount: number } {
		const attacker = this.getCurrentAttacker();
		const targetId = this.getTargetId();
		let log = "";
		let needNewPrompt = false;
		let playerTookDamage = false;
		let playerDamageAmount = 0;
		
		// Process player attack
		if (correct) {
			// Mark this card as correctly answered
			this.correctlyAnsweredCardIds.add(attacker.id);
			
			// Apply damage to target
			const target = this.getCurrentDefender();
			const damage = attacker.damage;
			target.hp -= damage;
			log = `${attacker.term} deals ${damage} damage to ${target.term}!`;
			
			// Check if target is defeated
			if (target.hp <= 0) {
				this.enemyQueue.shift(); // Remove defeated card
				log += ` ${target.term} is defeated!`;
			}
		} else {
			// When incorrect, the current card takes damage first
			const selfDamage = 10; // Self-damage for wrong answers
			attacker.hp -= selfDamage;
			log = `${attacker.term} missed the attack and took ${selfDamage} damage!`;
			playerTookDamage = true;
			playerDamageAmount = selfDamage;
			
			// Check if card defeated itself with the wrong answer
			if (attacker.hp <= 0) {
				this.playerQueue.shift(); // Remove defeated player card
				log += ` ${attacker.term} is defeated!`;
				this.correctlyAnsweredCardIds.delete(attacker.id); // Remove from correctly answered set
				needNewPrompt = true;
			} else {
				// Move the card to the back only if it survived
				const currentCard = this.playerQueue.shift();
				if (currentCard) this.playerQueue.push(currentCard);
				needNewPrompt = true;
			}
		}
		
		// Process enemy attack - only if the player's card wasn't already defeated
		if (this.enemyQueue.length > 0 && this.playerQueue.length > 0 && attacker.hp > 0) {
			const enemyAttackResult = this.processEnemyAttack();
			log += " " + enemyAttackResult.log;
			
			// Only set these if player wasn't already damaged from a wrong answer
			if (!playerTookDamage && enemyAttackResult.hit) {
				playerTookDamage = true;
				playerDamageAmount = enemyAttackResult.damage;
			}
		}
		
		// Check if active player card is defeated from enemy attack
		if (this.playerQueue.length > 0 && this.playerQueue[0].hp <= 0) {
			const defeatedCard = this.playerQueue.shift(); // Remove defeated player card
			if (defeatedCard) {
				log += ` ${defeatedCard.term} is defeated!`;
				this.correctlyAnsweredCardIds.delete(defeatedCard.id); // Remove from correctly answered set
			}
			needNewPrompt = true;
		}
		
		// Check if game is over
		const done = this.enemyQueue.length === 0 || this.playerQueue.length === 0;
		
		// Always need a new prompt if the front card changed
		if (this.playerQueue.length > 0 && attacker !== this.playerQueue[0]) {
			needNewPrompt = true;
		}
		
		return { log, done, targetId, needNewPrompt, playerTookDamage, playerDamageAmount };
	}

	processEnemyAttack(): { log: string; hit: boolean; damage: number } {
		const enemy = this.getCurrentDefender();
		const playerCard = this.getCurrentAttacker();
		let log = "";
		let hit = false;
		let damage = 0;
		
		// 80% chance to hit
		if (Math.random() < 0.8) {
			hit = true;
			damage = enemy.damage;
			playerCard.hp -= damage;
			log = `${enemy.term} attacks ${playerCard.term} for ${damage} damage!`;
			
			// Check if player card is defeated
			if (playerCard.hp <= 0) {
				this.playerQueue.shift(); // Remove defeated player card
				this.correctlyAnsweredCardIds.delete(playerCard.id); // Remove from correctly answered set
				log += ` ${playerCard.term} is defeated!`;
			}
		} else {
			log = `${enemy.term} tried to attack but missed!`;
		}
		
		return { log, hit, damage };
	}

	getTargetId() {
		const target = this.getCurrentDefender();
		return target ? Number(target.id) : null;
	}
}
