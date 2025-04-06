// src/lib/battle/BattleManager.ts
import { docs } from '$lib/client/firebase';
import { getDoc, updateDoc } from '@firebase/firestore';
import {
	type Card,
	type Deck,
	type Game,
	type Hand,
	type PowerUp,
	GameOutcome,
	GameState
} from './index';
import { writable } from 'svelte/store';
import { Tween } from 'svelte/motion';
import { sineOut } from 'svelte/easing';
import { validateAnswer } from './validation';

export class BattleManager {
	gameId: string;
	game: Game | undefined = $state(undefined);

	playerCardQueue: Card[] = $state([]);
	enemyCardQueue: Card[] = $state([]);

	appliedPowerUps: Record<string, PowerUp[]> = $state({});
	playerHand: Card[] = $state([]);
	enemyHand: Card[] = $state([]);
	gameOutcome: GameOutcome | null = $state(null);

	// For the hand preparation stage
	availablePowerUps: PowerUp[] = [];
	playerCoins: number = $state(100); // Starting coins

	countdown: number = $state(0);
	totalTime: number = $state(10);

	roundNumber: number = $state(0);
	totalRounds: number = $state(5);

	player1Ready: boolean = false;
	player2Ready: boolean = true;

	attacking: boolean = $state(false);

	constructor(gameId: string) {
		this.gameId = gameId;
		this.game = undefined;

		console.log(gameId);

		// Initialize some default power-ups
		this.initPowerUps();

		getDoc(docs.game(gameId))
			.then((doc) => {
				console.log(doc);
				if (!doc.exists()) throw new Error('Game does not exist');
				this.game = doc.data() as Game;

				// Get game data
				const gameData = doc.data() as Game;

				// Ensure game ID is set
				gameData.id = gameData.id || doc.id;

				// Add default HP and damage to cards if missing
				if (gameData.deck && gameData.deck.cards) {
					gameData.deck.cards = gameData.deck.cards.map((card) => ({
						...card,
						// Default values if missing
						hp: card.base_health || 100,
						damage: card.base_dmg || 25
					}));
				}

				this.game = gameData;

				// Shuffle the deck
				this.playerCardQueue = this.shuffleDeck([...this.game.deck.cards]);
				this.enemyCardQueue = this.shuffleDeck([...this.game.deck.cards]);

				// Initial setup - deal 6 cards to player hand
				this.dealInitialHand();

				this.game.gameState = GameState.HandSetup;
			})
			.catch((err) => {
				console.error('Error loading game:', err);
				throw new Error('Failed to load game');
			});
	}

	private initPowerUps() {
		this.availablePowerUps = [
			{
				id: 'powerup_health',
				name: 'Health Boost',
				description: 'Increases card HP by 20',
				cost: 25,
				effect: (card) => ({ ...card, base_health: card.base_health + 20 }),
				icon: '❤️'
			},
			{
				id: 'powerup_damage',
				name: 'Damage Boost',
				description: 'Increases card damage by 15',
				cost: 25,
				effect: (card) => ({ ...card, base_dmg: card.base_dmg + 15 }),
				icon: '⚔️'
			},
			{
				id: 'powerup_balanced',
				name: 'Balanced Boost',
				description: 'Increases both HP and damage by 10',
				cost: 40,
				effect: (card) => ({
					...card,
					base_health: card.base_health + 10,
					base_dmg: card.base_dmg + 10
				}),
				icon: '⚖️'
			},
			{
				id: 'powerup_mega',
				name: 'Mega Boost',
				description: 'Increases HP by 30 and damage by 20',
				cost: 75,
				effect: (card) => ({
					...card,
					base_health: card.base_health + 30,
					base_dmg: card.base_dmg + 20
				}),
				icon: '🌟'
			}
		];
	}

	private shuffleDeck(cards: Card[]): Card[] {
		const shuffled = [...cards];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	private dealInitialHand() {
		// Deal 6 cards to player's hand
		this.playerHand = this.playerCardQueue.splice(0, 6);

		// For enemy (AI), also deal 6 cards
		this.enemyHand = this.enemyCardQueue.splice(0, 6);
	}

	public reorderPlayerHand(newHandOrder: Card[]) {
		// Update the player's hand with the new order
		this.playerHand = newHandOrder;
	}

	public applyPowerUp(cardId: string, powerUpId: string) {
		const powerUp = this.availablePowerUps.find((p) => p.id === powerUpId);
		const cardIndex = this.playerHand.findIndex((c) => c.id === cardId);

		if (powerUp && cardIndex !== -1 && this.playerCoins >= powerUp.cost) {
			// Apply the power-up effect
			this.playerHand[cardIndex] = powerUp.effect({ ...this.playerHand[cardIndex] });

			// Deduct coins
			this.playerCoins -= powerUp.cost;

			return true;
		}

		return false;
	}

	private generateEnemyHand() {
		// Generate a random hand for the enemy
		const enemyDeck = this.game?.deck.cards || [];
		const shuffledDeck = this.shuffleDeck(enemyDeck);
		const handSize = Math.min(5, shuffledDeck.length);
		this.enemyHand = shuffledDeck.slice(0, handSize);
	}

	/**
	 * Updates the game state in Firestore
	 * @returns Promise that resolves when the update is complete
	 */
	private async pushGameToFirestore(): Promise<void> {
		try {
			if (!this.game) {
				console.error('Cannot update: game is undefined');
				return;
			}

			// Get a reference to the game document
			const gameRef = docs.game(this.gameId);

			// Update the document with the current game state
			await updateDoc(gameRef, {
				gameState: this.game.gameState,
				player1Hand: {
					cards: this.playerHand
				},
				player2Hand: {
					cards: this.enemyHand
				},
				roundHistory: this.game.roundHistory || [],
				roundNumber: this.game.roundNumber || 0,
				// Add timestamp for last updated
				lastUpdated: new Date()
			});

			console.log('Game state saved to Firestore');
		} catch (error) {
			console.error('Error updating game in Firestore:', error);
			throw new Error('Failed to save game state');
		}
	}

	public async finishHandPreparation() {
		if (!this.game) return;
		this.player1Ready = true;

		if (!this.player1Ready || !this.player2Ready) return;

		this.player1Ready = false;
		this.player2Ready = false;

		this.game.gameState = GameState.Battle;
		this.generateEnemyHand();

		// Save the updated game state
		await this.pushGameToFirestore();
	}

	public async processTurn(userInput: string) {
		if (this.attacking) return;

		this.player1Ready = true;
		while (this.player1Ready) {
			console.log('Processing turn...');
			const valid = validateAnswer(userInput, this.playerHand[0].term);
			const robotValid = Math.random() < 0.5;
			await this.attack(valid, robotValid);
		}
	}

	attack(valid: boolean, robotValid: boolean): Promise<void> {
		console.log(valid, robotValid);
		this.attacking = true;

		// Create clones of the cards to work with
		const attacker = { ...this.playerHand[0] };
		const target = { ...this.enemyHand[0] };

		// Calculate new health values
		const newAttackerHealth = attacker.base_health - (robotValid ? target.base_dmg : 0);
		const newTargetHealth = target.base_health - (valid ? attacker.base_dmg : 0);

		// Update the cards in the arrays with new health values
		this.playerHand[0] = { ...attacker, base_health: newAttackerHealth };
		this.enemyHand[0] = { ...target, base_health: newTargetHealth };

		// Log attack results
		console.log(
			'attack: ' +
				(valid ? `Player deals ${attacker.base_dmg} damage` : 'Player misses') +
				', ' +
				(robotValid ? `Enemy deals ${target.base_dmg} damage` : 'Enemy misses')
		);

		// Return a promise that resolves when the animation is complete
		return new Promise((resolve) => {
			setTimeout(() => {
				this.attacking = false;

				if (newAttackerHealth <= 0) {
					this.playerHand.shift();
					this.player1Ready = false;
				}

				if (newTargetHealth <= 0) {
					this.enemyHand.shift();
				}

				// if player card is wrong and survived, move it to the back of the queue
				if (newAttackerHealth > 0 && !valid) {
					const currentCard = this.playerHand.shift();
					if (currentCard) this.playerHand.push(currentCard);
					this.player1Ready = false;
				}

				// check if player lost
				if (this.playerHand.length === 0) {
					this.gameOutcome = GameOutcome.Loss;
				}
				if (this.enemyHand.length === 0) {
					this.gameOutcome = GameOutcome.Win;
				}
				if (this.playerHand.length === 0 && this.enemyHand.length === 0) {
					this.gameOutcome = GameOutcome.Draw;
				}
				// check if game is over
				if (this.gameOutcome && this.game != null) {
					this.player1Ready = false;
					this.game.gameState = GameState.EndScreen;
				}

				resolve();
			}, 1000);
		});
	}
}
// processTurn(correct: boolean): {
// 	log: string;
// 	done: boolean;
// 	needNewPrompt: boolean;
// 	playerTookDamage: boolean;
// 	playerDamageAmount: number;
// } {
// 	console.log('Processing turn...');
// 	const attacker = this.getCurrentAttacker();
// 	let log = '';
// 	let needNewPrompt = false;
// 	let playerTookDamage = false;
// 	let playerDamageAmount = 0;
// 	const target = this.getCurrentDefender();

// 	this.playerHistory.push(correct);

// 	// Process player attack
// 	console.log('Processing player attack...');
// 	if (correct) {
// 		// Mark this card as correctly answered
// 		this.correctlyAnsweredCardIds.add(attacker.id);

// 		// Apply damage to target
// 		const damage = attacker.damage;
// 		target.hp -= damage;
// 		log = `Player: ${attacker.term} deals ${damage} damage to Enemy: ${target.term}!`;
// 	} else {
// 		// When incorrect, the current card takes damage first
// 		log = `${attacker.term} missed the attack`;
// 	}
// 	console.log('Player attack processed.');
// 	console.log('Processing enemy attack...');
// 	// Process enemy attack: 50% chance to hit by default
// 	let enemyHit = false;
// 	if (this.enemyFuture.length > 0) {
// 		enemyHit = this.enemyFuture[0];
// 		this.enemyFuture.shift();
// 	} else {
// 		enemyHit = Math.random() < 0.5;
// 	}

// 	if (enemyHit) {
// 		let damage = target.damage;
// 		attacker.hp -= damage;
// 		log = `Enemy: ${target.term} attacks Player: ${attacker.term} for ${damage} damage!`;

// 		// Check if player card is defeated
// 		if (attacker.hp <= 0) {
// 			this.playerQueue.shift(); // Remove defeated player card
// 			this.correctlyAnsweredCardIds.delete(attacker.id); // Remove from correctly answered set
// 			log += ` ${attacker.term} is defeated!`;
// 		}
// 	} else {
// 		log = `Enemy: ${target.term} tried to attack but missed!`;
// 	}

// 	// Move player card to the back of the queue if wrong answer and survived
// 	if (attacker.hp > 0 && !correct) {
// 		// Move the card to the back only if it survived
// 		const currentCard = this.playerQueue.shift();
// 		if (currentCard) this.playerQueue.push(currentCard);
// 		needNewPrompt = true;
// 	}

// 	// Check if target is defeated
// 	if (target.hp <= 0) {
// 		this.enemyQueue.shift(); // Remove defeated card
// 		log += ` ${target.term} is defeated!`;
// 	}

// 	// Check if active player card is defeated from enemy attack
// 	if (this.playerQueue.length > 0 && this.playerQueue[0].hp <= 0) {
// 		const defeatedCard = this.playerQueue.shift(); // Remove defeated player card
// 		if (defeatedCard) {
// 			log += ` ${defeatedCard.term} is defeated!`;
// // 			this.correctlyAnsweredCardIds.delete(defeatedCard.id); // Remove from correctly answered set
// // 		}
// // 		needNewPrompt = true;
// // 	}

// // 	// Check if game is over - modified to detect simultaneous defeat
// // 	const playerDefeated = this.playerQueue.length === 0;
// // 	const enemyDefeated = this.enemyQueue.length === 0;
// // 	const done = playerDefeated || enemyDefeated;

// // 	// Always need a new prompt if the front card changed
// // 	if (this.playerQueue.length > 0 && attacker !== this.playerQueue[0]) {
// // 		needNewPrompt = true;
// // 	}
// // 	console.log('Turn processed.');
// // 	console.log('Player health:', attacker.hp);
// // 	console.log('Enemy health:', target.hp);
// // 	return { log, done, needNewPrompt, playerTookDamage, playerDamageAmount };
// // }
// }
