<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import GameHistoryCard from '$lib/components/GameHistory.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';

	let { data }: PageProps = $props();
	let { user, games, stats } = data;
</script>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
	<div class="mb-4 flex items-center gap-4">
		<div>
			<img
				src={user.avatarUrl}
				alt="{user.username}'s avatar"
				class="h-32 w-32 rounded-full object-cover"
			/>
		</div>
		<div>
			<h1 class="text-4xl">{user.username}</h1>
			<p class="my-2 text-neutral-300">
				Member since {new Date(user.joinDate).toLocaleDateString()}
			</p>
			<div class="flex gap-4">
				{#each user.badges as badge}
					<span class="cursor-help text-2xl" title={badge.description}>{badge.icon}</span>
				{/each}
			</div>
		</div>
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
