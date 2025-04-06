<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import { BattleManager } from './game/manager.svelte';
	import { float } from '$lib/client/transitions';

	const { battleManager } = $props();
</script>

<div
	class="flex h-screen w-full flex-col items-center justify-center"
	in:float={{ duration: 400, opacity: 100, x: '100vw' }}
	out:float={{ duration: 400, opacity: 100, x: '-100vw', out: true }}
>
	<div
		class="flex h-48 w-96 animate-pulse flex-col items-center justify-center rounded-md bg-white shadow-lg"
	>
		<p class="mb-2 text-xl">Game Over!</p>
	</div>
</div>
