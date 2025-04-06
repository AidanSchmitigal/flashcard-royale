<!-- src/lib/components/HandPreparationStage.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Card, PowerUp } from './game/index';
	import { fly, fade, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import type { BattleManager } from './game/manager.svelte';
	import { float } from '$lib/client/transitions';
	import GameCard from './GameCard.svelte';

	const { battleManager }: { battleManager: BattleManager } = $props();
	let availablePowerUps = battleManager.availablePowerUps;

	// Track which card is being dragged and which powerup is being dragged
	let draggedCard: Card | null = $state(null);
	let draggedPowerUp: PowerUp | null = $state(null);
	let dropTargetIndex: number | null = $state(null);
	let powerUpTargetCard: Card | null = $state(null);

	function handleDragStart(card: Card, index: number) {
		draggedCard = card;
		draggedPowerUp = null;
	}

	function handlePowerUpDragStart(powerUp: PowerUp) {
		draggedPowerUp = powerUp;
		draggedCard = null;
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (draggedCard) {
			dropTargetIndex = index;
		}
	}

	function handleCardDragOver(e: DragEvent, card: Card) {
		e.preventDefault();
		if (draggedPowerUp) {
			powerUpTargetCard = card;
		}
	}

	function handleDrop(e: DragEvent, index: number) {
		e.preventDefault();
		if (draggedCard && dropTargetIndex !== null) {
			// Reorder the cards in hand
			const newHand = [...battleManager.playerHand];
			const draggedIndex = battleManager.playerHand.findIndex((c) => c.id === draggedCard?.id);
			console.log(draggedIndex);
			const filteredHand = newHand.filter((c) => c.id !== draggedCard?.id);
			filteredHand.splice(index, 0, draggedCard);

			console.log(filteredHand.map((c) => c.id));

			battleManager.reorderPlayerHand(filteredHand); // Update manager state

			battleManager.playerHand = filteredHand;
		}

		dropTargetIndex = null;
		draggedCard = null;
	}

	function handlePowerUpDrop(e: DragEvent, card: Card) {
		e.preventDefault();
		console.log(card);
		if (draggedPowerUp && powerUpTargetCard) {
			if (battleManager.playerCoins >= draggedPowerUp.cost) {
				// Apply power-up to the card
				const cardIndex = battleManager.playerHand.findIndex((c) => c.id === card.id);
				if (cardIndex !== -1) {
					const updatedCard = draggedPowerUp.effect({ ...battleManager.playerHand[cardIndex] });

					// Create new arrays to ensure reactivity
					const newHand = [...battleManager.playerHand];
					newHand[cardIndex] = updatedCard;

					// Update local state
					battleManager.playerHand = newHand;

					// Update powerups tracking
					if (!battleManager.appliedPowerUps[card.id]) {
						battleManager.appliedPowerUps[card.id] = [];
					}
					battleManager.appliedPowerUps[card.id] = [
						...battleManager.appliedPowerUps[card.id],
						draggedPowerUp
					];
					battleManager.appliedPowerUps = { ...battleManager.appliedPowerUps };

					battleManager.applyPowerUp(card.id, draggedPowerUp.id);
					battleManager.playerHand = newHand;
				}
			} else {
				alert('Not enough coins to purchase this power-up!');
			}
		}

		powerUpTargetCard = null;
		draggedPowerUp = null;
	}

	function finishPlanning() {
		// dispatch('finishPlanning', { hand: playerHand });
		battleManager.finishHandPreparation();
	}
</script>

<div
	class="mx-auto flex max-w-7xl flex-col gap-6 p-4 pt-32"
	in:float={{ duration: 400, opacity: 100, x: '100vw' }}
	out:float={{ duration: 400, opacity: 100, x: '-100vw', out: true }}
>
	<h2 class="text-center text-2xl font-bold">Plan Your Battle Hand</h2>
	<div class="self-end rounded-full bg-amber-100 px-4 py-2 font-bold text-amber-800 shadow-md">
		Coins:
		{#key battleManager.playerCoins}
			<span class="inline-block" out:fly={{ y: 10, duration: 200 }}
				>{battleManager.playerCoins}</span
			>
		{/key}
	</div>

	<div class="flex flex-row-reverse flex-wrap justify-center gap-4">
		{#each battleManager.playerHand as card, i (card.id)}
			<div
				aria-label="Drag card to rearrange order"
				role="listitem"
				class="relative h-64 w-48 rounded-lg border-2 border-dashed p-2 transition-all duration-200 ease-in-out"
				class:border-blue-500={dropTargetIndex === i}
				class:bg-blue-50={dropTargetIndex === i}
				class:border-amber-500={powerUpTargetCard?.id === card.id}
				class:bg-amber-50={powerUpTargetCard?.id === card.id}
				ondragstart={() => handleDragStart(card, i)}
				ondragover={(e) => (handleDragOver(e, i), handleCardDragOver(e, card))}
				ondrop={(e) => (handleDrop(e, i), handlePowerUpDrop(e, card))}
				animate:flip={{ duration: 300 }}
			>
				<GameCard {card} {battleManager} />
				<div
					class="absolute -top-2.5 left-1/2 -translate-x-1/2 transform rounded-full bg-gray-800 px-2 py-0.5 text-xs text-white"
				>
					Position: {i + 1}
				</div>
			</div>
		{/each}
	</div>

	<div class="rounded-lg bg-gray-50 p-4">
		<h3 class="mb-3 text-lg font-semibold">Available Power-ups</h3>
		<div class="flex flex-wrap gap-4">
			{#each availablePowerUps as powerUp (powerUp.id)}
				<div
					role="listitem"
					class="w-44 rounded-lg border border-gray-200 p-3 shadow-sm transition-transform duration-200 select-none"
					class:bg-white={battleManager.playerCoins >= powerUp.cost}
					class:bg-gray-100={battleManager.playerCoins < powerUp.cost}
					class:cursor-grab={battleManager.playerCoins >= powerUp.cost}
					class:cursor-not-allowed={battleManager.playerCoins < powerUp.cost}
					class:opacity-60={battleManager.playerCoins < powerUp.cost}
					class:hover:-translate-y-0.5={battleManager.playerCoins >= powerUp.cost}
					draggable={battleManager.playerCoins >= powerUp.cost}
					ondragstart={battleManager.playerCoins >= powerUp.cost
						? () => handlePowerUpDragStart(powerUp)
						: null}
				>
					<div class="mb-2 text-center text-2xl">{powerUp.icon}</div>
					<div class="mb-1 flex justify-between text-sm select-none">
						<span class="font-bold">{powerUp.name}</span>
						<span
							class="font-bold"
							class:text-amber-600={battleManager.playerCoins >= powerUp.cost}
							class:text-gray-500={battleManager.playerCoins < powerUp.cost}
						>
							{powerUp.cost} coins
						</span>
					</div>
					<div class="text-xs text-gray-600 select-none">{powerUp.description}</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- <div class="rounded-lg bg-blue-50 p-4 text-sm">
		<p class="mb-1">Drag cards to rearrange their order in battle</p>
		<p>Drag power-ups onto cards to enhance them</p>
	</div> -->

	<button
		class="cursor-pointer self-center rounded-lg bg-green-600 px-6 py-3 font-bold text-white shadow-md transition-colors duration-200 hover:bg-green-700"
		onclick={finishPlanning}
	>
		Done Planning
	</button>
</div>
