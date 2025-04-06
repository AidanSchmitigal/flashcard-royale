<script lang="ts">
	import { sineOut } from 'svelte/easing';
	import type { BattleManager } from './game/manager.svelte';

	const { battleManager }: { battleManager: BattleManager } = $props();
</script>

<div class="timer-container">
	<div class="timer-icon">🕒</div>
	<div class="bar-outer">
		<div
			class="bar-inner"
			style="width: {sineOut(battleManager.countdown / battleManager.totalTime) * 100}%"
		></div>
	</div>
</div>

<style>
	.timer-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 1rem 0;
	}

	.timer-icon {
		font-size: 2rem;
		background: #ffce00;
		border-radius: 50%;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
	}

	.bar-outer {
		flex: 1;
		height: 1rem;
		background-color: #ddd;
		border-radius: 999px;
		overflow: hidden;
		box-shadow: inset 0 0 5px #999;
	}

	.bar-inner {
		height: 100%;
		background: linear-gradient(to right, #ff4444, #ff9900);
		transition: width 0.1s linear;
	}
</style>
