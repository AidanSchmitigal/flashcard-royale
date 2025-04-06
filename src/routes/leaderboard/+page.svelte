<script>
	let signedInUsername = "SignedInUser";

	let leaderboard = [
		{ username: "Player1", gamesWon: 50 },
		{ username: "Player2", gamesWon: 45 },
		{ username: "Player3", gamesWon: 40 },
		{ username: "Player4", gamesWon: 35 },
		{ username: "Player5", gamesWon: 30 },
		{ username: "Player6", gamesWon: 25 },
		{ username: "Player7", gamesWon: 20 },
		{ username: "Player8", gamesWon: 15 },
		{ username: "Player9", gamesWon: 10 },
		{ username: "Player10", gamesWon: 5 },
		{ username: "SignedInUser", gamesWon: 3 },
		{ username: "Player12", gamesWon: 2 },
		{ username: "Player13", gamesWon: 1 }
	];

	leaderboard.sort((a, b) => b.gamesWon - a.gamesWon);

	const signedInUser = leaderboard.find((player) => player.username === signedInUsername);
	const signedInUserPosition = leaderboard.indexOf(signedInUser) + 1;
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
					<th class="py-3 px-4">Games Won</th>
				</tr>
			</thead>
			<tbody>
				{#each leaderboard.slice(0, 10) as player, index}
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
						<td class="py-2 px-4">{player.username}</td>
						<td class="py-2 px-4">{player.gamesWon}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<hr class="my-8 border-t-2 border-black" />

	<h2 class="text-2xl font-semibold mb-2">Your Position</h2>
	<p class="text-lg">
		Rank: <span class="font-bold">{signedInUserPosition}</span> <br />
		Username: <span class="font-bold">{signedInUser?.username || 'Unknown User'}</span> <br />
		Games Won: <span class="font-bold">{signedInUser?.gamesWon || 0}</span>
	</p>
</div>
