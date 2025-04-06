<script lang="ts">
	import { onMount } from 'svelte';
	import { mockDeck } from '$lib/game/mockDeck';
	import { createCardFromFlashcard } from '$lib/game/index';
	import { BattleManager } from '$lib/game/manager';
	import { validateAnswer } from '$lib/game/validation';

	let battle: BattleManager;
	let currentCardTerm = '';
	let currentCardDef = '';
	let userInput = '';
	let logs: string[] = [];
	let gameOver = false;

	onMount(() => {
		const playerCards = mockDeck.map((c) => createCardFromFlashcard(c.term, c.definition));
		const enemyCards = mockDeck.map((c) => createCardFromFlashcard(c.term, c.definition));
		battle = new BattleManager(playerCards, enemyCards);
		loadCurrentPrompt();
	});

	function loadCurrentPrompt() {
		const attacker = battle.getCurrentAttacker();
		const promptType = Math.random() > 0.5 ? 'term' : 'definition';

		currentCardTerm = attacker.term;
		currentCardDef = attacker.definition;
	}

	function handleSubmit() {
		const attacker = battle.getCurrentAttacker();
		const prompt = Math.random() > 0.5 ? attacker.term : attacker.definition;
		const expected = prompt === attacker.term ? attacker.definition : attacker.term;

		const correct = validateAnswer(userInput, expected);
		const result = battle.processTurn(correct);

		logs = [result.log, ...logs];
		userInput = '';

		if (result.done) {
			gameOver = true;
		} else {
			loadCurrentPrompt();
		}
	}
</script>

{#if !gameOver}
	<div class="mx-auto flex h-screen w-fit flex-col justify-center">
		<div class="flex items-center gap-16">
			<div class="flex gap-4">
				{#each mockDeck as card}
					<div class="mb-4 bg-amber-100 p-4">
						<p class="text-lg">{card.term.substring(0, 2)}</p>
					</div>
				{/each}
			</div>
			<div>VS.</div>
			<div class="flex gap-4">
				{#each mockDeck as card}
					<div class="mb-4 bg-amber-100 p-4">
						<p class="text-lg">{card.definition.substring(0, 2)}</p>
					</div>
				{/each}
			</div>
		</div>
		<div class="mx-auto flex gap-16">
			<p class="h-48 w-96 rounded-md bg-white text-center shadow-lg">{currentCardTerm}</p>
			<form on:submit|preventDefault={handleSubmit} class="mb-4 flex h-48 w-96 flex-col">
				<input
					bind:value={userInput}
					placeholder="Type your answer..."
					class="mb-2 h-full w-full border px-4 py-2"
				/>
				<button type="submit" class="rounded bg-blue-600 px-4 py-2 text-white"> Attack! </button>
			</form>
		</div>
	</div>
{:else}
	<div class="mx-auto max-w-xl p-8 text-center">
		<h2 class="text-3xl font-bold">🎉 Victory!</h2>
		<p class="mt-4">You defeated all enemy cards!</p>
	</div>
{/if}
