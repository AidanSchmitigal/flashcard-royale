<script lang="ts">
	import type { Card } from './game';
	import type { BattleManager } from './game/manager.svelte';

	const { card, battleManager }: { card: Card; battleManager: BattleManager } = $props();

	function getCardGradientClass(hp: number): string {
		if (hp >= 50) {
			return 'bg-gradient-to-br from-amber-100 to-orange-200'; // Orange gradient for 50+
		} else if (hp >= 35) {
			return 'bg-gradient-to-br from-purple-100 to-indigo-200'; // Purple gradient for 35-45
		} else if (hp >= 20) {
			return 'bg-gradient-to-br from-green-100 to-emerald-200'; // Green gradient for 20-30
		} else {
			return 'bg-gradient-to-br from-gray-100 to-slate-200'; // Gray gradient for 5-15
		}
	}
</script>

<div
	role="listitem"
	class="flex h-full flex-col overflow-hidden rounded-lg shadow-md {getCardGradientClass(
		card.base_health
	)}"
	draggable="true"
>
	<div class="flex flex-1 flex-col p-3">
		<img
			src="/src/lib/images/logo-small.png"
			alt="Card"
			class="pointer-events-none h-15 w-auto object-contain"
		/>
		{#if battleManager.appliedPowerUps[card.id] && battleManager.appliedPowerUps[card.id].length > 0}
			<div class="mt-2 flex w-full justify-center gap-2">
				{#each battleManager.appliedPowerUps[card.id] as powerUp}
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl shadow-md"
						title={powerUp.name}
					>
						{powerUp.icon}
					</div>
				{/each}
			</div>
		{/if}
		<div class="mt-auto flex flex-wrap justify-between border-t border-gray-200 pt-2">
			<div
				class="rounded bg-green-100 px-2 py-1 text-sm font-bold whitespace-nowrap text-green-800"
			>
				HP: {card.base_health}
			</div>
			<div class="rounded bg-red-100 px-2 py-1 text-sm font-bold whitespace-nowrap text-red-800">
				DMG: {card.base_dmg}
			</div>
		</div>
	</div>
</div>
