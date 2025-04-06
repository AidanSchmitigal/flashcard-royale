<script lang="ts">
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import BattlePhase from './BattlePhase.svelte';
	import EndScreenPhase from './EndScreenPhase.svelte';
	import { GameState, type Game } from './game';
	import { BattleManager } from './game/manager.svelte';
	import HandSetupPhase from './HandSetupPhase.svelte';

	const { data } = $props();
	const gameId = data.gameId;
	const battleManager = new BattleManager(gameId);
</script>

{#if battleManager.game == null || battleManager.game.gameState === GameState.Loading}
	<div class="flex h-screen w-full flex-col items-center justify-center">
		<div
			class="flex h-48 w-96 animate-pulse flex-col items-center justify-center rounded-md bg-white shadow-lg"
		>
			<p class="mb-2 text-xl">Loading...</p>
		</div>
	</div>
{:else if battleManager.game.gameState === GameState.HandSetup}
	<HandSetupPhase {battleManager} />
{:else if battleManager.game.gameState === GameState.Battle}
	<BattlePhase {battleManager} />
{:else if battleManager.game.gameState === GameState.EndScreen}
	<EndScreenPhase {battleManager} />
{/if}
