<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import { BattleManager } from './game/manager.svelte';
	import { float } from '$lib/client/transitions';
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';
	import { updateUser, auth, user } from '$lib/client/firebase';
	import { GameOutcome } from './game';

	const { battleManager }: { battleManager: BattleManager } = $props();

	const possibleStyles = {
		[GameOutcome.Win]: {
			bgColor: 'bg-green-100',
			textColor: 'text-green-700',
			borderColor: 'border-green-400',
			emoji: '🏆',
			message: 'Congratulations! You won!'
		},
		[GameOutcome.Loss]: {
			bgColor: 'bg-red-100',
			textColor: 'text-red-700',
			borderColor: 'border-red-400',
			emoji: '😢',
			message: 'Better luck next time!'
		},
		[GameOutcome.Draw]: {
			bgColor: 'bg-blue-100',
			textColor: 'text-blue-700',
			borderColor: 'border-blue-400',
			emoji: '🤝',
			message: "It's a draw!"
		}
	};

	// Define different styles and messages based on game outcome
	let outcomeStyles = $derived(
		battleManager.gameOutcome
			? possibleStyles[battleManager.gameOutcome]
			: {
					bgColor: 'bg-gray-100',
					textColor: 'text-gray-700',
					borderColor: 'border-gray-400',
					emoji: '🎮',
					message: 'Game Over!'
				}
	);

	function launchConfetti() {
		confetti({
			particleCount: 150,
			spread: 70,
			origin: { y: 0.6 }
		});
	}

	// async function updateUserStats() {
	// 	if (!$user || !auth.currentUser) return;

	// 	const userId = auth.currentUser.uid;
	// 	const statUpdate = {};

	// 	// Increment the appropriate stat based on outcome
	// 	statUpdate[`stats.gamesPlayed`] = ($user.stats?.gamesPlayed || 0) + 1;

	// 	if (battleManager.gameOutcome === GameOutcome.Win) {
	// 		statUpdate[`stats.gamesWon`] = ($user.stats?.gamesWon || 0) + 1;
	// 	} else if (battleManager.gameOutcome === GameOutcome.Loss) {
	// 		statUpdate[`stats.gamesLost`] = ($user.stats?.gamesLost || 0) + 1;
	// 	} else if (battleManager.gameOutcome === GameOutcome.Draw) {
	// 		statUpdate[`stats.gamesDraw`] = ($user.stats?.gamesDraw || 0) + 1;
	// 	}

	// 	try {
	// 		await updateUser(userId, statUpdate);
	// 		console.log('User stats updated successfully');
	// 	} catch (error) {
	// 		console.error('Error updating user stats:', error);
	// 	}
	// }

	$effect(() => {
		if (battleManager.gameOutcome == GameOutcome.Win) {
			launchConfetti();
			setTimeout(() => launchConfetti(), 800);
			setTimeout(() => launchConfetti(), 1600);
		}
	});

	function playAgain() {
		window.location.href = '/play';
	}
</script>

<div
	class="flex h-screen w-full flex-col items-center justify-center bg-gray-50"
	in:float={{ duration: 400, opacity: 100, x: '100vw' }}
	out:float={{ duration: 400, opacity: 100, x: '-100vw', out: true }}
>
	<div
		class={`flex flex-col items-center justify-center rounded-lg ${outcomeStyles.bgColor} border-2 ${outcomeStyles.borderColor} w-full max-w-md p-8 shadow-xl transition-all duration-300 hover:shadow-2xl`}
	>
		<div class="mb-4 text-6xl">{outcomeStyles.emoji}</div>
		<h1 class={`mb-4 text-3xl font-bold ${outcomeStyles.textColor}`}>Game Over!</h1>
		<p class={`mb-6 text-xl ${outcomeStyles.textColor}`}>{outcomeStyles.message}</p>

		<div class="mb-6 w-full rounded-lg bg-white p-4 shadow-inner">
			<h3 class="mb-2 text-lg font-semibold text-gray-700">Game Summary</h3>
			<div class="flex justify-between">
				<p class="text-gray-600">Outcome:</p>
				<p class="font-medium">{battleManager.gameOutcome}</p>
			</div>
		</div>

		<div class="flex gap-4">
			<button
				on:click={playAgain}
				class="rounded-md bg-blue-600 px-6 py-2 font-medium text-white shadow-md transition-colors hover:bg-blue-700"
			>
				Play Again
			</button>
			<a
				href="/"
				class="rounded-md bg-gray-200 px-6 py-2 font-medium text-gray-800 shadow-md transition-colors hover:bg-gray-300"
			>
				Return Home
			</a>
		</div>
	</div>
</div>
