<script lang="ts">
	import { updateUser } from '$lib/client/firebase';
	import GameHistoryCard from '$lib/components/GameHistory.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import { AvatarColor, AvatarColorClasses } from '$lib/client/types';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// const freeAvatars = [
	// 	{ id: 'blue', label: 'Blue', class: 'bg-blue-400' },
	// 	{ id: 'green', label: 'Green', class: 'bg-green-400' },
	// 	{ id: 'red', label: 'Red', class: 'bg-red-400' },
	// 	{ id: 'purple', label: 'Purple', class: 'bg-purple-400' },
	// 	{ id: 'orange', label: 'Orange', class: 'bg-orange-400' }
	// ];

	// const unlockableAvatars = [
	// 	{
	// 		id: 'gradient1',
	// 		label: 'Sunset',
	// 		class: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
	// 		requiredWins: 5
	// 	},
	// 	{
	// 		id: 'gradient2',
	// 		label: 'Ocean Wave',
	// 		class: 'bg-gradient-to-br from-blue-400 via-teal-400 to-green-400',
	// 		requiredWins: 10
	// 	},
	// 	{
	// 		id: 'gradient3',
	// 		label: 'Mystic Night',
	// 		class: 'bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-600',
	// 		requiredWins: 20
	// 	}
	// ];

	let showAvatarPicker = $state(false);

	// async function changeAvatarColor(color: AvatarColor) {
	// 	const isFree = freeAvatars.find((a) => a.id === color);
	// 	const isUnlocked = unlockableAvatars.find(
	// 		(a) => a.id === color && (user.stats.gamesWon ?? 0) >= a.requiredWins
	// 	);
	// 	if ((isFree || isUnlocked) && user != null) {
	// 		user.avatarColor = color;
	// 		showAvatarPicker = false;
	// 		if (user) {
	// 			updateUser(user.uid, {
	// 				avatarColor: color
	// 			});
	// 		}
	// 	}
	// }

	const userPromise = data.user;

	const badges = [
		{ icon: '🏆', description: 'Top Scorer' },
		{ icon: '🎯', description: 'Accuracy Master' }
	];

	const games = [
		{
			result: 'hkjsdf',
			gameName: 'hkjsdf',
			playedAt: 'hkjsdf',
			score: 'hkjsdf',
			playTime: 'hkjsdf',
			xpEarned: 'hkjsdf',
			achievements: 'hkjsdf'
		}
	];
	const joinDate = '2025-04-03T12:34:56Z';
</script>

{#await userPromise}
	<div class="flex min-h-screen items-center justify-center bg-gray-100 text-gray-800">
		<div class="text-center">
			<h1 class="text-6xl font-bold">Loading...</h1>
			<p class="mt-2 text-lg">Loading user data...</p>
		</div>
	</div>
{:then user}
	{#if user == null}
		<div class="flex min-h-screen items-center justify-center bg-gray-100 text-gray-800">
			<div class="text-center">
				<h1 class="text-6xl font-bold">User not found</h1>
				<p class="mt-2 text-lg">User not found.</p>
				<a href="/" class="text-blue-600 hover:underline">Go back home</a>
			</div>
		</div>
	{:else}
		<div class="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pt-32">
			<div class="mb-4 flex items-center gap-4">
				<div>
					<div class="relative">
						<button
							class={`flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-4 border-white text-4xl font-bold text-white shadow-md ${AvatarColorClasses[AvatarColor.Blue]}`}
							onclick={() => (showAvatarPicker = !showAvatarPicker)}
						>
							{#if user.displayName}
								{user.displayName.charAt(0).toUpperCase()}
							{/if}
						</button>

						<!-- {#if showAvatarPicker}
						<div class="absolute top-28 left-0 z-10 flex gap-2 rounded bg-white p-2 shadow">
							{#each Object.entries(AvatarColorClasses) as [color, className]}
								<button
									aria-label="Change Avatar Color"
									class={`h-10 w-10 cursor-pointer rounded-full ${className} transition hover:scale-110`}
									on:click={() => changeAvatarColor(color as AvatarColor)}
								></button>
							{/each}
						</div>
					{/if} -->
					</div>
				</div>
				<div>
					<h2 class="text-2xl font-semibold text-gray-800">{user.displayName ?? 'No Name'}</h2>
					<p class="text-gray-500">{user.email}</p>
					<p class="mt-1 text-sm text-neutral-400">
						Member since {new Date(joinDate).toLocaleDateString()}
					</p>
					<div class="mt-2 flex gap-3">
						{#each badges as badge}
							<span class="cursor-help text-xl" title={badge.description}>{badge.icon}</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- Battle Pass Meter -->
			<div class="mb-6 w-full">
				<h3 class="mb-1 font-semibold text-blue-800">Battle Pass Progress</h3>
				<div class="h-5 w-full overflow-hidden rounded-full bg-gray-200">
					<div
						class="h-5 bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
						style={`width: ${Math.min((user.stats.gamesWon ?? 0) * 3.33, 100)}%`}
					></div>
				</div>
				<p class="mt-1 text-sm text-gray-600">
					{user.stats.gamesWon ?? 0} wins • {100 -
						Math.min((user.stats.gamesWon ?? 0) * 3.33, 100)}% to max
				</p>
			</div>

			<StatsOverview stats={user.stats} />

			<div class="flex flex-col gap-4">
				{#if games.length === 0}
					<p class="text-neutral-400">No games played yet.</p>
				{:else}
					{#each games as game}
						<GameHistoryCard {game} />
					{/each}
				{/if}
			</div>
		</div>
	{/if}
{/await}
