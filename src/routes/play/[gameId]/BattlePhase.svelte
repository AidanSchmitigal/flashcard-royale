<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Card } from './game/index';
	import { fly, fade, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import type { BattleManager } from './game/manager.svelte';
	import { float } from '$lib/client/transitions';
	import GameCard from './GameCard.svelte';

	const { battleManager }: { battleManager: BattleManager } = $props();

	let userInput = $state('');
	function handleSubmit() {}
	let showFeedback = false;
	let isCorrect = false;
	const logs: string[] = [];
</script>

<div
	class="flex h-screen w-full flex-col items-center justify-center"
	in:float={{ duration: 400, opacity: 100, x: '100vw' }}
	out:float={{ duration: 400, opacity: 100, x: '-100vw', out: true }}
>
	<!-- Combined card section: player cards, VS, enemy cards all in one row -->
	<div class="flex w-full items-center justify-center gap-8 overflow-x-auto p-4">
		<!-- Player cards -->
		<div class="flex flex-row-reverse gap-1">
			{#each battleManager.playerHand as card, i (`player-${i}-${card.id}`)}
				<div
					class="relative h-40 w-28 rounded-lg border-2 border-solid p-1 transition-all duration-200 ease-in-out sm:h-48 sm:w-36"
					class:border-blue-500={i === 0}
					transition:fade
				>
					<GameCard {card} {battleManager} />
					{#if i === 0}
						<div
							class="absolute -top-2 left-1/2 -translate-x-1/2 transform rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white"
						>
							Active
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- VS text in the middle -->
		<div
			class="mx-1 flex-shrink-0 rounded-full bg-gray-800 px-2 py-1 text-sm font-bold text-white sm:px-3 sm:py-1.5 sm:text-base"
		>
			VS
		</div>

		<!-- Enemy cards -->
		<div class="flex gap-1">
			{#each battleManager.enemyHand as card, i (`enemy-${i}-${card.id}`)}
				<div
					class="relative h-40 w-28 rounded-lg border-2 border-solid p-1 transition-all duration-200 ease-in-out sm:h-48 sm:w-36"
					class:border-red-500={i === 0}
					transition:fade
				>
					<GameCard {card} {battleManager} />
					{#if i === 0}
						<div
							class="absolute -top-2 left-1/2 -translate-x-1/2 transform rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white"
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
		<!-- Note card display -->
		<div
			class="flex h-48 w-96 flex-col items-center justify-center rounded-md bg-white p-3 shadow-lg"
		>
			<img
				src="/src/lib/images/logo-small.png"
				alt="Card"
				class="pointer-events-none mb-2 h-10 w-auto object-contain"
			/>
			<p class="text-xl font-semibold">{battleManager.playerHand[0].term}</p>
			<div class="mt-auto w-full border-t border-gray-200"></div>
		</div>

		<!-- Answer input card -->
		<div class="flex h-48 w-96 flex-col overflow-hidden rounded-md bg-white p-3 shadow-lg">
			<img
				src="/src/lib/images/logo-small.png"
				alt="Card"
				class="pointer-events-none mb-2 h-10 w-auto object-contain"
			/>
			<div class="flex flex-grow flex-col">
				<input
					placeholder="Write your translation here..."
					class="w-full flex-grow border-0 bg-amber-50/20 px-4 py-2 text-center text-lg focus:bg-amber-50/40 focus:outline-none"
					disabled={showFeedback}
					bind:value={userInput}
				/>
			</div>
			<div class="mt-auto w-full border-t border-gray-200 pt-2">
				<button
					type="submit"
					class="w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
					disabled={showFeedback}
					on:click={handleSubmit}
				>
					Attack!
				</button>
			</div>
		</div>
	</div>
</div>
