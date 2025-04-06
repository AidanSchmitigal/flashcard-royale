<script lang="ts">
	import logoSmall from '$lib/images/logo-small.png';
	import type { Card } from './game/index';
	import { fly, fade, slide, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import type { BattleManager } from './game/manager.svelte';
	import { float } from '$lib/client/transitions';
	import GameCard from './GameCard.svelte';
	import TimerBar from './TimerBar.svelte';

	const { battleManager }: { battleManager: BattleManager } = $props();

	let userInput = $state('');
	function handleSubmit(e: SubmitEvent) {
		console.log(userInput);
		e.preventDefault();
		battleManager.processTurn(userInput);
	}
</script>

<div
	class="pattern-happy-intersection-neutral-100 flex h-screen w-full flex-col items-center justify-center"
	in:float={{ duration: 400, opacity: 100, x: '100vw' }}
	out:float={{ duration: 400, opacity: 100, x: '-100vw', out: true }}
>
	<div class="flex min-w-full items-center justify-center gap-8 overflow-x-hidden py-16">
		<!-- Player cards -->
		<div class="flex w-full flex-row-reverse gap-1">
			{#each battleManager.playerHand as card, i (card.id)}
				<div
					class="relative h-40 w-28 cursor-grab rounded-lg border-2 border-solid p-1 transition-all duration-200 ease-in-out sm:h-48 sm:w-36"
					class:border-blue-500={i === 0}
					class:animate-attack-right={battleManager.attacking && i === 0}
					out:scale
					animate:flip={{ duration: 300 }}
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
		<div class="flex w-full gap-1">
			{#each battleManager.enemyHand as card, i (card.id)}
				<div
					class="relative h-40 w-28 cursor-grab rounded-lg border-2 border-solid p-1 transition-all duration-200 ease-in-out sm:h-48 sm:w-36"
					class:border-red-500={i === 0}
					class:animate-attack-left={battleManager.attacking && i === 0}
					out:scale
					animate:flip={{ duration: 300 }}
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
			class="relative flex h-48 w-96 flex-col items-center justify-center rounded-md bg-white p-3 shadow-lg"
		>
			<img
				src={logoSmall}
				alt="Card"
				class="pointer-events-none absolute top-4 left-4 mb-2 h-10 w-auto object-contain"
			/>
			<p class="text-xl font-semibold">{battleManager.playerHand[0].definition}</p>
		</div>

		<!-- Answer input card -->
		<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
			<for
				class="relative flex h-48 w-96 flex-col overflow-hidden rounded-md bg-white p-3 shadow-lg"
			>
				<img
					src={logoSmall}
					alt="Card"
					class="pointer-events-none absolute top-4 left-4 mb-2 h-10 w-auto object-contain"
				/>
				<div class="flex flex-grow flex-col">
					<input
						placeholder="Write your answer here..."
						class="w-full flex-grow border-0 bg-amber-50/20 px-4 py-2 text-center text-lg focus:bg-amber-50/40 focus:outline-none"
						bind:value={userInput}
					/>
				</div>
			</for>
			<button
				type="submit"
				class="w-full cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
			>
				Attack!
			</button>
		</form>
	</div>
</div>
