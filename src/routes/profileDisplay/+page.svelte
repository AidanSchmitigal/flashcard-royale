<script lang="ts">
	import { auth, db } from '$lib/client/firebase';
	import { onMount } from 'svelte';
	import { doc, getDoc } from 'firebase/firestore';
	import { writable } from 'svelte/store';
	import type { User } from 'firebase/auth';
	import { fetchFavoriteDecks } from '$lib/client/getFavoriteDecks';

	const user = writable<User | null>(null);
	const userData = writable<any>(null);
	const favoriteDecks = writable([]); // Must be a store if you're using $favoriteDecks

	onMount(async () => {
		auth.onAuthStateChanged(async (currentUser) => {
			user.set(currentUser);

			if (currentUser) {
				// Try to fetch from Firestore
				const userDocRef = doc(db, 'users', currentUser.uid);
				const docSnap = await getDoc(userDocRef);

				if (docSnap.exists()) {
					userData.set(docSnap.data());
				} else {
					// Fallback to Firebase Auth displayName/email
					userData.set({
						name: currentUser.displayName ?? 'No Name',
						email: currentUser.email,
						wins: 0,
						gamesPlayed: 0
					});
				}
			}
			if (auth.currentUser) {
				const userId = auth.currentUser.uid;
				// ... fetch decks logic ...
				const decks = await fetchFavoriteDecks(userId); // your own function
				favoriteDecks.set(decks);
			}
		});
	});
</script>


<div class="mx-auto mt-20 max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<div class="flex items-center gap-6">
		<img
			src="https://via.placeholder.com/100"
			alt="Profile"
			class="h-24 w-24 rounded-full border border-gray-300"
		/>
		<div>
			<h2 class="text-2xl font-semibold text-gray-800">
				{#if $userData?.name}
					{$userData.name}
				{:else}
					No Name
				{/if}
			</h2>
			
			<p class="text-gray-500">{$userData?.email}</p>
		</div>
	</div>

	<hr class="my-6" />

	<div class="grid grid-cols-2 gap-6">
		<div>
			<h3 class="text-lg font-semibold text-gray-700">Games Won</h3>
			<p class="text-2xl font-bold text-indigo-600">{$userData?.gamesWon ?? 0}</p>
		</div>
		<div>
			<h3 class="text-lg font-semibold text-gray-700">Win Percentage</h3>
			<p class="text-2xl font-bold text-indigo-600">
				{#if $userData}
				<p class="text-2xl font-bold text-indigo-600">
					{#if $userData}
						{Math.round((($userData.wins ?? 0) / ($userData.gamesPlayed ?? 1)) * 100)}%
					{:else}
						0%
					{/if}
				</p>
				
				{:else}
					0%
				{/if}
			</p>
		</div>
	</div>

	<hr class="my-6" />

	<div>
		<h3 class="mb-4 text-xl font-semibold text-blue-900">Favorite Decks</h3>
		<ul class="space-y-2">
			{#each $favoriteDecks as deck}
			<li class="rounded border border-gray-200 p-4 shadow-sm">
			  <div class="flex justify-between">
				<span class="font-medium text-gray-800">{deck.title}</span>
				<span class="text-sm text-gray-500">{deck.playCount} plays</span>
			  </div>
			</li>
		  {/each}
		</ul>
	</div>
</div>
