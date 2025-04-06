<script lang="ts">
	import { onMount } from 'svelte';
	import { mockDeck } from './game/mockDeck';
	import { createCardFromFlashcard } from './game/index';
	import { BattleManager } from './game/manager';
	import { validateAnswer } from './game/validation';
	import { fade, fly } from 'svelte/transition';
	import { addGameHistory, getGames } from './game/data';
	import { auth, db } from '$lib/client/firebase';
	import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

	let battle: BattleManager;
	let currentCardTerm = '';
	let currentCardDef = '';
	let userInput = '';
	let logs: string[] = [];
	let gameOver = false;
	let gameResult: 'victory' | 'defeat' | 'draw' | null = null;
	let savingResult = false;
	let resultSaved = false;
	let resultError = false;

	// TODO
	let deckId = '0';

	// Track active cards in battle
	let playerCards: any[] = [];
	let enemyCards: any[] = [];

	// Added feedback variables
	let showFeedback = false;
	let isCorrect = false;
	let correctAnswer = '';
	let promptShown = '';

	// Animation states
	let cardTakingDamage = '';
	let playerTakingDamage = false;

	// Track cards that have been correctly answered
	let activatedCardIds = new Set<string | number>();

	// Flag to track when we've just changed to a new card (due to death or wrong answer)
	let justChangedCard = false;

	onMount(() => {
		// Initialize battle
		playerCards = mockDeck.map((c) =>
			createCardFromFlashcard(c.term, c.definition, c.health, c.damage)
		);
		enemyCards = mockDeck.map((c) =>
			createCardFromFlashcard(c.term, c.definition, c.health, c.damage)
		);

		// TODO
		/*
        const games = await getGames(deckId);
        const history: boolean[] = []
        if (games.length > 0) {
            history = games.moves
        }
        */
		const history: boolean[] = [];
		battle = new BattleManager(playerCards, enemyCards, history);

		// Sync our local arrays with battle manager's state
		playerCards = battle.getPlayerCards();
		enemyCards = battle.getEnemyCards();

		loadCurrentPrompt();
	});

	function loadCurrentPrompt() {
		const attacker = battle.getCurrentAttacker();

		// Skip prompt if the card was already answered correctlyprocessTurn
		if (battle.isCardAnsweredCorrectly(attacker.id)) {
			// Auto-process the turn for correctly answered cards
			processTurnWithoutInput(true);
			return;
		}

		// Always ask for the term and provide the definition
		promptShown = attacker.definition;
		correctAnswer = attacker.term;

		currentCardTerm = promptShown;
		showFeedback = false;
		cardTakingDamage = '';
	}

	async function updateUserGameStats(result: 'victory' | 'defeat' | 'draw') {
		if (!auth.currentUser) {
			console.error("Cannot update stats: User not logged in");
			return false;
		}

		try {
			savingResult = true;
			const userId = auth.currentUser.uid;
			const userRef = doc(db, 'users', userId);
			
			// Update the appropriate counter based on game result
			if (result === 'victory') {
				await updateDoc(userRef, {
					gamesWon: increment(1)
				});
			} else if (result === 'defeat') {
				await updateDoc(userRef, {
					gamesLost: increment(1)
				});
			} else if (result === 'draw') {
				await updateDoc(userRef, {
					gamesDrawn: increment(1)
				});
			}
			
			return true;
		} catch (error) {
			console.error("Error updating user game stats:", error);
			return false;
		} finally {
			savingResult = false;
		}
	}

	function processTurnWithoutInput(correct: boolean) {
		// Process turn with the result
		const result = battle.processTurn(correct);
		if (result.done) {
			addGameHistory({
				id: crypto.randomUUID(),
				ownerId: auth.currentUser?.uid || '',
				deckId,
				moves: battle.playerHistory,
				time: new Date(),
				createdAt: new Date(),
				won: gameResult === 'victory'
			});
		}

		logs = [result.log, ...logs];

		// Update our local arrays with battle manager's state IMMEDIATELY
		playerCards = battle.getPlayerCards();
		enemyCards = battle.getEnemyCards();

		// Mark the target card for damage animation
		if (correct && enemyCards.length > 0) {
			cardTakingDamage = enemyCards[0].id; // Set to the current target's ID
		}

		// Mark player card for damage animation if it took damage
		if (result.playerTookDamage) {
			playerTakingDamage = true;
		}

		// After a short delay, clean up animations and move to next prompt or end game
		setTimeout(
			() => {
				playerTakingDamage = false;
				cardTakingDamage = '';

				if (result.done) {
					gameOver = true;
					
					// Determine game result
					if (playerCards.length === 0 && enemyCards.length === 0) {
						gameResult = 'draw';
					} else if (playerCards.length > 0) {
						gameResult = 'victory';
					} else {
						gameResult = 'defeat';
					}
					
					// Save result to database
					if (auth.currentUser) {
						updateUserGameStats(gameResult)
							.then(success => {
								resultSaved = success;
								resultError = !success;
							})
							.catch(err => {
								console.error("Failed to save game result:", err);
								resultError = true;
							});
					}
				} else {
					// Sync activated cards set with battle manager's state
					activatedCardIds = new Set(battle.correctlyAnsweredCardIds);

					if (result.needNewPrompt) {
						// Player needs to answer for the new card
						loadCurrentPrompt();
					} else {
						// Continue with the next turn immediately if no new prompt needed
						processTurnWithoutInput(true);
					}
				}
			},
			correct ? 2000 : 2000
		); // Shorter delay for auto-attacks // Bruh
	}

	function handleSubmit() {
		// Validate the answer and show feedback
		isCorrect = validateAnswer(userInput, correctAnswer);
		showFeedback = true;

		userInput = '';

		// After feedback delay, process the turn
		setTimeout(() => {
			processTurnWithoutInput(isCorrect);
		}, 1500);
	}
</script>

{JSON.stringify(playerCards)}

{#if !gameOver}
	<div class="mx-auto flex h-screen w-fit flex-col justify-center">
		<div class="flex items-center justify-between gap-16">
			<!-- Player cards -->
			<div class="flex flex-row-reverse gap-4">
				{#each playerCards as card, i (`player-${i}-${card.id}`)}
					<div
						class="relative mb-4 rounded bg-amber-100 p-4 shadow-sm"
						class:ring-2={i === 0}
						class:ring-blue-500={i === 0}
						class:bg-green-100={battle.isCardAnsweredCorrectly(card.id)}
						class:animate-pulse={i === 0 && playerTakingDamage}
						transition:fade
					>
						<p class="text-lg">{card.term.substring(0, 4)}</p>
						<div class="mt-2 flex justify-between gap-6 text-sm">
							<span class="text-red-600">❤️ {card.hp}</span>
							<span class="text-blue-600">⚔️ {card.damage}</span>
						</div>
						{#if i === 0}
							<div
								class="absolute -bottom-3 left-1/2 -translate-x-1/2 transform rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white"
							>
								Active
							</div>
						{/if}
						{#if battle.isCardAnsweredCorrectly(card.id)}
							<div
								class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white"
							>
								✓
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<div>VS.</div>

			<!-- Enemy cards -->
			<div class="flex gap-4">
				{#each enemyCards as card, i (`enemy-${i}-${card.id}`)}
					<div
						class="relative mb-4 rounded bg-amber-100 p-4 shadow-sm"
						class:ring-2={i === 0}
						class:ring-red-500={i === 0}
						class:animate-pulse={cardTakingDamage === card.id}
						transition:fade
					>
						<p class="text-lg">{card.definition.substring(0, 4)}</p>
						<div class="mt-2 flex justify-between gap-6 text-sm">
							<span class="text-red-600">❤️ {card.hp}</span>
							<span class="text-blue-600">⚔️ {card.damage}</span>
						</div>
						{#if i === 0}
							<div
								class="absolute -bottom-3 left-1/2 -translate-x-1/2 transform rounded-full bg-red-500 px-2 py-0.5 text-xs text-white"
							>
								Target
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Card and input section -->
		<div class="mx-auto flex gap-16">
			<div
				class="flex h-48 w-96 flex-col items-center justify-center rounded-md bg-white shadow-lg"
			>
				<p class="mb-2 text-xl">{currentCardTerm}</p>

				<!-- Feedback section -->
				{#if showFeedback}
					<div class={`mt-4 rounded p-2 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
						<p class="font-bold">{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</p>
						{#if !isCorrect}
							<p class="mt-1 text-sm">Correct answer: {correctAnswer}</p>
						{/if}
					</div>
				{/if}
			</div>

			<form on:submit|preventDefault={handleSubmit} class="mb-4 flex h-48 w-96 flex-col">
				<input
					bind:value={userInput}
					placeholder="Type your answer..."
					class="mb-2 h-full w-full border px-4 py-2"
					disabled={showFeedback}
				/>
				<button
					type="submit"
					class="rounded bg-blue-600 px-4 py-2 text-white"
					disabled={showFeedback}
				>
					Attack!
				</button>
			</form>
		</div>

		<!-- Battle log -->
		<div class="mx-auto mt-8 max-h-32 w-96 overflow-y-auto">
			<h3 class="mb-2 font-bold">Battle Log:</h3>
			{#each logs as log, i}
				<p class="text-sm" class:font-bold={i === 0}>{log}</p>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto max-w-xl p-8 text-center">
		<h2 class="text-3xl font-bold">
			{#if gameResult === 'victory'}
				🎉 Victory!
			{:else if gameResult === 'defeat'}
				😢 Defeat!
			{:else}
				🤝 Draw!
			{/if}
		</h2>
		<p class="mt-4">
			{#if gameResult === 'victory'}
				You defeated all enemy cards!
			{:else if gameResult === 'defeat'}
				All your cards were defeated!
			{:else}
				Both sides were defeated simultaneously!
			{/if}
		</p>
		
		{#if auth.currentUser}
			<div class="mt-4 text-sm">
				{#if savingResult}
					<p class="text-blue-600">Saving your results...</p>
				{:else if resultSaved}
					<p class="text-green-600">Your results have been saved!</p>
				{:else if resultError}
					<p class="text-red-600">Failed to save results to your profile</p>
				{:else if !auth.currentUser}
					<p class="text-gray-600">Sign in to save your game results</p>
				{/if}
			</div>
		{/if}
		
		<button
			class="mt-8 rounded bg-blue-600 px-4 py-2 text-white"
			on:click={() => (window.location.href = '/')}
		>
			Return to Home
		</button>
	</div>
{/if}
