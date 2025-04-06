<script lang="ts">
	import { auth, db, updateUser, user } from '$lib/client/firebase';
	import { onMount } from 'svelte';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import type { PageProps } from './$types';
	import GameHistoryCard from '$lib/components/GameHistory.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import { writable } from 'svelte/store';
	import type { User } from '@firebase/auth';
	import { fetchUserDecks } from '$lib/client/getUserDecks';

	// const user = writable<User | null>(null);
	const userData = writable<any>(null);
	const userDecks = writable([]);
	const avatarColor = writable('blue');

	let showAvatarPicker = false;

	async function changeAvatarColor(color: string) {
		avatarColor.set(color);
		showAvatarPicker = false;

		if ($user) {
			updateUser($user.uid, {
				avatarColor: color
			});
		}
	}

	// onMount(async () => {
	// 	auth.onAuthStateChanged(async (currentUser) => {
	// 		user.set(currentUser);

	// 		if (currentUser) {
	// 			const userDocRef = doc(db, 'users', currentUser.uid);
	// 			const docSnap = await getDoc(userDocRef);

	// 			if (docSnap.exists()) {
	// 				const data = docSnap.data();
	// 				userData.set(data);

	// 				if (data.avatarColor) {
	// 					avatarColor.set(data.avatarColor);
	// 				}
	// 			} else {
	// 				userData.set({
	// 					name: currentUser.displayName ?? 'No Name',
	// 					email: currentUser.email,
	// 					wins: 0,
	// 					gamesPlayed: 0
	// 				});
	// 			}

	// 			const decks = await fetchUserDecks(currentUser.uid);
	// 			userDecks.set(decks);
	// 		}
	// 	});
	// });

	const badges = [
		{
			icon: 'icons',
			description: 'descriptions'
		}
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

<div class="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pt-32">
	<div class="mb-4 flex items-center gap-4">
		<div>
			<div class="relative">
				<button
					class={`flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-4 border-white text-4xl font-bold text-white shadow-md ${avatarColorClasses[$avatarColor]}`}
					on:click={() => (showAvatarPicker = !showAvatarPicker)}
				>
					{#if $userData?.name}
						{$userData.name.charAt(0).toUpperCase()}
					{/if}
				</button>

				{#if showAvatarPicker}
					<div class="absolute top-28 left-0 z-10 flex gap-2 rounded bg-white p-2 shadow">
						{#each Object.keys(avatarColorClasses) as color}
							<button
								aria-label="Change Avatar Color"
								class={`h-10 w-10 cursor-pointer rounded-full ${avatarColorClasses[color]} transition hover:scale-110`}
								on:click={() => changeAvatarColor(color)}
							></button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<div>
			<h2 class="text-2xl font-semibold text-gray-800">
				{#if $userData?.name}
					{$userData.name}
				{:else}
					No Name
				{/if}
			</h2>
			<p class="my-2 text-neutral-300">
				Member since {new Date(joinDate).toLocaleDateString()}
			</p>
			<div class="flex gap-4">
				{#each badges as badge}
					<span class="cursor-help text-2xl" title={badge.description}>{badge.icon}</span>
				{/each}
			</div>
		</div>
	</div>

	<StatsOverview stats={$user.stats} />

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
