<script lang="ts">
	import { auth, db } from '$lib/client/firebase';
	import { onMount } from 'svelte';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import { writable } from 'svelte/store';
	import type { User } from 'firebase/auth';
	import { fetchUserDecks } from '$lib/client/getUserDecks';

	const user = writable<User | null>(null);
	const userData = writable<any>(null);
	const userDecks = writable([]);
	const avatarColor = writable('blue');

	const avatarColorClasses: Record<string, string> = {
		blue: 'bg-blue-400',
		green: 'bg-green-400',
		red: 'bg-red-400',
		purple: 'bg-purple-400',
		orange: 'bg-orange-400'
	};

	let showAvatarPicker = false;

	async function changeAvatarColor(color: string) {
		avatarColor.set(color);
		showAvatarPicker = false;

		if ($user) {
			const userDocRef = doc(db, 'users', $user.uid);
			await updateDoc(userDocRef, { avatarColor: color });
		}
	}

	onMount(async () => {
		auth.onAuthStateChanged(async (currentUser) => {
			user.set(currentUser);

			if (currentUser) {
				const userDocRef = doc(db, 'users', currentUser.uid);
				const docSnap = await getDoc(userDocRef);

				if (docSnap.exists()) {
					const data = docSnap.data();
					userData.set(data);

					if (data.avatarColor) {
						avatarColor.set(data.avatarColor);
					}
				} else {
					userData.set({
						name: currentUser.displayName ?? 'No Name',
						email: currentUser.email,
						wins: 0,
						gamesPlayed: 0
					});
				}

				const decks = await fetchUserDecks(currentUser.uid);
				userDecks.set(decks);
			}
		});
	});
</script>

<!-- Main container -->
<div class="mx-auto mt-20 max-w-4xl rounded-lg bg-white p-6 shadow-lg">
	<!-- Profile Avatar + Name -->
	<div class="flex items-center gap-6 mb-8">
		<!-- Avatar section -->
		<div class="relative">
			<div
			class={`h-24 w-24 flex items-center justify-center text-white text-4xl font-bold rounded-full border-4 border-white shadow-md cursor-pointer ${avatarColorClasses[$avatarColor]}`}
			on:click={() => (showAvatarPicker = !showAvatarPicker)}
		>
			{#if $userData?.name}
				{$userData.name.charAt(0).toUpperCase()}
			{/if}
		</div>
		
			{#if showAvatarPicker}
				<div class="absolute top-28 left-0 flex gap-2 rounded bg-white p-2 shadow z-10">
					{#each Object.keys(avatarColorClasses) as color}
						<div
							class={`h-10 w-10 rounded-full cursor-pointer ${avatarColorClasses[color]} hover:scale-110 transition`}
							on:click={() => changeAvatarColor(color)}
						></div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Name + Email -->
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

	<!-- Stats -->
	<div class="grid grid-cols-2 gap-6">
		<div>
			<h3 class="text-lg font-semibold text-gray-700">Games Won</h3>
			<p class="text-2xl font-bold text-indigo-600">{$userData?.gamesWon ?? 0}</p>
		</div>
		<div>
			<h3 class="text-lg font-semibold text-gray-700">Win Percentage</h3>
			<p class="text-2xl font-bold text-indigo-600">
				{Math.round((($userData?.wins ?? 0) / ($userData?.gamesPlayed ?? 1)) * 100)}%
			</p>
		</div>
	</div>

	<hr class="my-6" />

	<!-- User Decks -->
	<div>
		<h3 class="mb-4 text-xl font-semibold text-blue-900">Your Uploaded Decks</h3>
		{#if $userDecks.length > 0}
			<ul class="space-y-2">
				{#each $userDecks as deck}
					<li class="rounded border border-gray-200 p-4 shadow-sm">
						<div class="flex justify-between">
							<span class="font-medium text-gray-800">{deck.title}</span>
							<span class="text-sm text-gray-500">{deck.cardCount ?? 0} cards</span>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-gray-500">You haven’t uploaded any decks yet.</p>
		{/if}
	</div>
</div>
