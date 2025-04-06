<script lang="ts">
	import { auth, db } from '$lib/client/firebase';
	import { onMount } from 'svelte';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import type { PageProps } from './$types';
	import GameHistoryCard from '$lib/components/GameHistory.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import { writable, get } from 'svelte/store';
	import type { User } from '@firebase/auth';
	import { fetchUserDecks } from '$lib/client/getUserDecks';

	const user = writable<User | null>(null);
	const userData = writable<any>({});
	const userDecks = writable([]);
	const avatarColor = writable('blue');

	const freeAvatars = [
		{ id: 'blue', label: 'Blue', class: 'bg-blue-400' },
		{ id: 'green', label: 'Green', class: 'bg-green-400' },
		{ id: 'red', label: 'Red', class: 'bg-red-400' },
		{ id: 'purple', label: 'Purple', class: 'bg-purple-400' },
		{ id: 'orange', label: 'Orange', class: 'bg-orange-400' }
	];

	const unlockableAvatars = [
		{ id: 'gradient1', label: 'Sunset', class: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500', requiredWins: 5 },
		{ id: 'gradient2', label: 'Ocean Wave', class: 'bg-gradient-to-br from-blue-400 via-teal-400 to-green-400', requiredWins: 10 },
		{ id: 'gradient3', label: 'Mystic Night', class: 'bg-gradient-to-tr from-indigo-700 via-purple-600 to-pink-600', requiredWins: 20 }
	];

	let showAvatarPicker = false;

	async function changeAvatarColor(color: string) {
		const currentUser = get(user);
		const currentUserData = get(userData);
		const isFree = freeAvatars.find(a => a.id === color);
		const isUnlocked = unlockableAvatars.find(a => a.id === color && currentUserData?.wins >= a.requiredWins);

		if (isFree || isUnlocked) {
			avatarColor.set(color);
			showAvatarPicker = false;

			if (currentUser) {
				const userDocRef = doc(db, 'users', currentUser.uid);
				await updateDoc(userDocRef, { avatarColor: color });
			}
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
					userData.set({
						...data,
						wins: data.wins ?? data.gamesWon ?? 0,
						gamesPlayed: data.gamesPlayed ?? 0
					});
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

	const stats = 'STATS!!!';
	const joinDate = '2025-04-03T12:34:56Z';
</script>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pt-32">
	<div class="mb-4 flex items-center gap-4">
		<!-- Avatar -->
		<div class="relative">
			<div
				class={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-white text-4xl font-bold text-white shadow-md cursor-pointer ${[...freeAvatars, ...unlockableAvatars].find(a => a.id === $avatarColor)?.class ?? 'bg-blue-400'}`}
				on:click={() => (showAvatarPicker = !showAvatarPicker)}
			>
				{#if $userData?.name}
					{$userData.name.charAt(0).toUpperCase()}
				{/if}
			</div>

			{#if showAvatarPicker}
				<div class="absolute top-28 left-0 z-10 grid grid-cols-6 gap-4 p-4 w-80 rounded bg-white shadow-md">
					<!-- Free Avatars -->
					{#each freeAvatars as avatar}
						<div
							class={`h-10 w-10 rounded-full cursor-pointer ${avatar.class} hover:scale-110 transition`}
							on:click={() => changeAvatarColor(avatar.id)}
							title={avatar.label}
						></div>
					{/each}

					<!-- Unlockable Avatars -->
					{#each unlockableAvatars as avatar}
						{#if $userData?.wins >= avatar.requiredWins}
							<div
								class={`h-10 w-10 rounded-full cursor-pointer ${avatar.class} hover:scale-110 transition`}
								on:click={() => changeAvatarColor(avatar.id)}
								title={avatar.label}
							></div>
						{:else}
							<div class="relative opacity-50 cursor-not-allowed">
								<div class={`h-10 w-10 rounded-full ${avatar.class}`}></div>
								<div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white bg-black/50 rounded-full">
									{avatar.requiredWins}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>

		<!-- Name & Email -->
		<div>
			<h2 class="text-2xl font-semibold text-gray-800">{$userData?.name ?? 'No Name'}</h2>
			<p class="text-gray-500">{$userData?.email}</p>
			<p class="text-sm text-neutral-400 mt-1">
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
		<div class="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
			<div
				class="bg-gradient-to-r from-green-400 to-blue-500 h-5 transition-all duration-500"
				style={`width: ${Math.min(($userData?.wins ?? 0) * 3.33, 100)}%`}
			></div>
		</div>
		<p class="mt-1 text-sm text-gray-600">
			{$userData?.wins ?? 0} wins • {100 - Math.min(($userData?.wins ?? 0) * 3.33, 100)}% to max
		</p>
	</div>

	<StatsOverview {stats} />

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