<script lang="ts">
	import { updateUser, user as signedInUser } from '$lib/client/firebase';
	import GameHistoryCard from '$lib/components/GameHistory.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import { AvatarColor, AvatarColorClasses } from '$lib/client/types';
	import type { PageProps } from './$types';
	import { changeAvatarColor, freeAvatars, unlockableAvatars } from '$lib/client/battlepass';

	let { data }: PageProps = $props();
	let showAvatarPicker = $state(false);
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
							class={`flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-4 border-white text-4xl font-bold text-white shadow-md ${AvatarColorClasses[user.avatarColor]}`}
							onclick={() => (showAvatarPicker = !showAvatarPicker)}
						>
							{user.displayName?.charAt(0).toUpperCase()}
						</button>

						{#if showAvatarPicker && $signedInUser != null && $signedInUser.uid == user.uid}
							<div class="absolute top-28 left-0 z-10 grid grid-cols-5 gap-2 rounded bg-white p-4 shadow">
								<!-- Unlockable Avatars -->
								{#each unlockableAvatars as avatar}
									{#if user.stats.gamesWon >= avatar.requiredWins}
										<button
											aria-label="Change Avatar Color"
											class={`h-10 w-10 cursor-pointer rounded-full transition hover:scale-110 ${avatar.class}`}
											onclick={async () => {
												user.avatarColor = avatar.id as AvatarColor;
												await changeAvatarColor(avatar.id as AvatarColor);
												showAvatarPicker = false;
												window.location.reload();
											}}
										></button>
									{:else}
										<div class="relative h-10 w-10 rounded-full opacity-50 cursor-not-allowed">
											<div class={`h-full w-full rounded-full ${avatar.class}`}></div>
											<div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white bg-black/50 rounded-full">
												{avatar.requiredWins}
											</div>
										</div>
									{/if}
								{/each}

								<!-- Free Avatars -->
								{#each freeAvatars as avatar}
									<button
										aria-label="Change Avatar Color"
										class={`h-10 w-10 cursor-pointer rounded-full transition hover:scale-110 ${avatar.class}`}
										onclick={async () => {
											user.avatarColor = avatar.id as AvatarColor;
											await changeAvatarColor(avatar.id as AvatarColor);
											showAvatarPicker = false;
											window.location.reload();
										}}
									></button>
								{/each}
							</div>
						{/if}
					</div>
				</div>
				<div>
					<h2 class="text-2xl font-semibold text-gray-800">{user.displayName}</h2>
					<p class="mt-1 text-sm text-neutral-400">
						Member since {new Date(user.creationTime).toLocaleDateString()}
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
					{user.stats.gamesWon ?? 0} wins • {Math.min((user.stats.gamesWon ?? 0) * 3.33, 100)}% towards max
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