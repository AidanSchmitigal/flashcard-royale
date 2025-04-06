<script lang="ts">
	import { onMount } from 'svelte';
	import { getTopScoringUsers, getUserRank } from '$lib/client/leaderboard';
	import { auth } from '$lib/client/firebase';
	import { onDestroy } from 'svelte';
	import { user } from '$lib/client/firebase';

	let leaderboard: { name: string; gamesWon: number }[] = [];
	let signedInUsername = '';
	let signedInUserPosition = 0;
	let signedInUserStats = { name: '', gamesWon: 0 };
	let loading = true;
	let authChecked = false;
	let unsubscribe: (() => void) | null = null;

	async function loadLeaderboardData(currentUser: any) {
		try {
			// Always fetch leaderboard data regardless of auth state
			leaderboard = await getTopScoringUsers(10);
			
			if (currentUser) {
				const displayName = currentUser.displayName ?? currentUser.email ?? 'Anonymous';
				signedInUsername = displayName;
				
				// Get current user's rank
				const userRank = await getUserRank(currentUser.uid);
				
				if (userRank) {
					signedInUserPosition = userRank.rank;
					signedInUserStats = {
						name: displayName,
						gamesWon: userRank.gamesWon
					};
				}
			}
		} catch (error) {
			console.error("Error loading leaderboard:", error);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		// Use onAuthStateChanged to properly detect authentication state
		unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
			authChecked = true;
			await loadLeaderboardData(currentUser);
		});
	});

	onDestroy(() => {
		// Clean up the auth listener when component is destroyed
		if (unsubscribe) unsubscribe();
	});
</script>

<!-- HTML content -->
<div class="max-w-5xl mx-auto px-4 py-8 text-center font-sans">
	<h1 class="text-3xl font-bold mb-6">Leaderboard</h1>

	{#if loading && !authChecked}
		<div class="flex justify-center my-8">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
		</div>
	{:else}
		<div class="overflow-x-auto rounded-lg shadow bg-white p-4">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="bg-indigo-600 text-white">
						<th class="py-3 px-4">Rank</th>
						<th class="py-3 px-4">Username</th>
						<th class="py-3 px-4">Games Won</th>
					</tr>
				</thead>
				<tbody>
					{#each leaderboard as player, index}
						<tr
							class={`${
								player.name === signedInUsername
									? 'bg-blue-100 font-semibold'
									: index % 2 === 0
									? 'bg-gray-50'
									: 'bg-white'
							} hover:bg-indigo-50 transition`}
						>
							<td class="py-2 px-4">{index + 1}</td>
							<td class="py-2 px-4">{player.name}</td>
							<td class="py-2 px-4">{player.gamesWon}</td>
						</tr>
					{/each}
					
					{#if leaderboard.length === 0}
						<tr>
							<td colspan="3" class="py-6 text-center text-gray-500">No data available</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>

		<hr class="my-8 border-t-2 border-gray-300" />

		{#if auth.currentUser}
			<h2 class="text-2xl font-semibold mb-2">Your Position</h2>
			<p class="text-lg">
				Rank: <span class="font-bold">{signedInUserPosition || 'N/A'}</span> <br />
				Name: <span class="font-bold">{signedInUserStats.name}</span> <br />
				Games Won: <span class="font-bold">{signedInUserStats.gamesWon}</span>
			</p>
		{:else}
			<p class="text-lg">
				Sign in to see your ranking on the leaderboard!
			</p>
		{/if}
	{/if}
</div>