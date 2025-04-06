<script lang="ts">
	import { auth, db, updateUser, user } from '$lib/client/firebase';
	import { onMount } from 'svelte';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import type { PageProps } from './$types';
	import GameHistoryCard from '$lib/components/GameHistory.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import { writable, get } from 'svelte/store';
	import type { User } from '@firebase/auth';
	import { fetchUserDecks } from '$lib/client/getUserDecks';

	// const user = writable<User | null>(null);
	const userData = writable<any>(null);
	const userDecks = writable([]);
	const avatarColor = writable('blue');

	let showAvatarPicker = false;

	async function changeAvatarColor(color: string) {
		const currentUser = get(user);
		const currentUserData = get(userData);
		const isFree = freeAvatars.find(a => a.id === color);
		const isUnlocked = unlockableAvatars.find(a => a.id === color && currentUserData?.wins >= a.requiredWins);

		if (isFree || isUnlocked) {
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
			<h2 class="text-2xl font-semibold text-gray-800">{$userData?.name ?? 'No Name'}</h2>
			<p class="text-gray-500">{$userData?.email}</p>
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
				style={`width: ${Math.min(($userData?.wins ?? 0) * 3.33, 100)}%`}
			></div>
		</div>
		<p class="mt-1 text-sm text-gray-600">
			{$userData?.wins ?? 0} wins • {100 - Math.min(($userData?.wins ?? 0) * 3.33, 100)}% to max
		</p>
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
