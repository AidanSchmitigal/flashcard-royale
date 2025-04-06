<script lang="ts">
	import { onMount } from 'svelte';
	import { getTopScoringUsers, getUserRank } from '$lib/client/leaderboard';
	import { auth } from '$lib/client/firebase';

	let leaderboard = [];
	let signedInUsername = '';
	let signedInUserPosition = 0;
	let signedInUserStats = { name: '', score: 0, gamesWon: 0 };

	onMount(async () => {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			console.warn("User not signed in.");
			return;
		}
		const displayName = currentUser.displayName ?? currentUser.email ?? 'Anonymous';
		signedInUsername = displayName;
		console.log("Signed-in user:", displayName);

		leaderboard = await getTopScoringUsers(10);
		console.log("Fetched leaderboard:", leaderboard);

		const userRank = await getUserRank(currentUser.uid);
		console.log("User rank:", userRank);

		if (userRank) {
			signedInUserPosition = userRank.rank;
			signedInUserStats = {
				username: displayName,
				score: userRank.score,
				gamesWon: userRank.gamesWon
			};
		}
		signedInUserStats = {
			name: usersData[signedInUsername]?.name ?? 'You',
			score: userRank.score,
			gamesWon: userRank.gamesWon
		};
	});
</script>



<!-- HTML content -->
<div class="max-w-5xl mx-auto px-4 py-8 text-center font-sans">
	<h1 class="text-3xl font-bold mb-6">Leaderboard</h1>

	<div class="overflow-x-auto rounded-lg shadow bg-white p-4">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-indigo-600 text-white">
					<th class="py-3 px-4">Rank</th>
					<th class="py-3 px-4">Username</th>
					<th class="py-3 px-4">Score</th>
				</tr>
			</thead>
			<tbody>
				{#each leaderboard as player, index}
					<tr
						class={`${
							player.username === signedInUsername
								? 'bg-blue-100 font-semibold'
								: index % 2 === 0
								? 'bg-gray-50'
								: 'bg-white'
						} hover:bg-indigo-50 transition`}
					>
						<td class="py-2 px-4">{index + 1}</td>
						<td class="py-2 px-4">{player.name}</td>
						<td class="py-2 px-4">{player.score}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<hr class="my-8 border-t-2 border-black" />

	<h2 class="text-2xl font-semibold mb-2">Your Position</h2>
	<p class="text-lg">
		Rank: <span class="font-bold">{signedInUserPosition}</span> <br />
		Name: <span class="font-bold">{signedInUserStats.name}</span> <br />
		Games Won: <span class="font-bold">{signedInUserStats.gamesWon}</span>
	</p>
	
</div>
