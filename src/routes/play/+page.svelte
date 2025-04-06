<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import RecentDeckCard from '$lib/components/RecentDeckCard.svelte';
	import RecommendedDeckCard from '$lib/components/RecommendedDeckCard.svelte';
	import ImportDeckModal from '$lib/components/ImportDeckModal.svelte';

	let recentDecks: { id: string; title: string; cards: number; lastPlayed: string }[] = [];
	let recommendedDecks: { id: string; title: string; cards: number; difficulty: string; category: string }[] = [];
	let showImportModal = false;

	onMount(async () => {
		// Fetch recent decks from API/store
		recentDecks = await fetchRecentDecks();

		// Fetch recommended decks
		recommendedDecks = await fetchRecommendedDecks();
	});

	async function fetchRecentDecks() {
		// In a real app, this would call your API
		return [
			{ id: '1', title: 'Spanish Vocabulary', cards: 42, lastPlayed: '2025-04-03T12:34:56Z' },
			{ id: '2', title: 'Chemistry Formulas', cards: 25, lastPlayed: '2025-04-01T09:12:34Z' },
			{ id: '3', title: 'Historical Dates', cards: 30, lastPlayed: '2025-03-28T16:43:21Z' }
		];
	}

	async function fetchRecommendedDecks() {
		// In a real app, this would call your API
		return [
			{
				id: '101',
				title: 'Programming Concepts',
				cards: 50,
				difficulty: 'Medium',
				category: 'Tech'
			},
			{
				id: '102',
				title: 'Medical Terminology',
				cards: 75,
				difficulty: 'Hard',
				category: 'Medicine'
			},
			{ id: '103', title: 'World Capitals', cards: 35, difficulty: 'Easy', category: 'Geography' }
		];
	}

	function openImportModal() {
		showImportModal = true;
	}

	function closeImportModal() {
		showImportModal = false;
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Recent Decks Section -->
	{#if recentDecks.length > 0}
		<section class="mb-12">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-2xl font-semibold text-neutral-800">Recent Decks</h2>
				<a href="/decks" class="font-medium text-indigo-600 hover:text-indigo-800">View All</a>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each recentDecks as deck}
					<RecentDeckCard {deck} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Recommended Decks Section -->
	<section class="mb-12">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-2xl font-semibold text-neutral-800">Recommended Decks</h2>
			<button class="font-medium text-indigo-600 hover:text-indigo-800">Refresh</button>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each recommendedDecks as deck}
				<RecommendedDeckCard {deck} />
			{/each}
		</div>
	</section>

	<!-- Create/Import New Deck Section -->
	<section>
		<h2 class="mb-4 text-2xl font-semibold text-gray-800">Import New Deck</h2>
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<!-- Quizlet Import -->
				<button
					on:click={openImportModal}
					class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-indigo-500 hover:bg-indigo-50"
					data-import-type="quizlet"
				>
					<svg class="mb-2 h-10 w-10 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
						<path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"
						></path>
					</svg>
					<span class="text-lg font-medium text-gray-900">Quizlet Link</span>
					<p class="mt-1 text-sm text-gray-500">Import from existing Quizlet deck</p>
				</button>

				<!-- CSV Import -->
				<button
					on:click={openImportModal}
					class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-indigo-500 hover:bg-indigo-50"
					data-import-type="csv"
				>
					<svg class="mb-2 h-10 w-10 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="text-lg font-medium text-gray-900">CSV/Text</span>
					<p class="mt-1 text-sm text-gray-500">Copy & paste or upload CSV file</p>
				</button>

				<!-- Create New -->
				<button
					on:click={() => (window.location.href = '/create')}
					class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-indigo-500 hover:bg-indigo-50"
				>
					<svg class="mb-2 h-10 w-10 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
							clip-rule="evenodd"
						></path>
					</svg>
					<span class="text-lg font-medium text-gray-900">Create New</span>
					<p class="mt-1 text-sm text-gray-500">Build a custom deck from scratch</p>
				</button>
			</div>
		</div>
	</section>
</div>

{#if showImportModal}
	<div transition:fade={{ duration: 150 }}>
		<ImportDeckModal onClose={closeImportModal} />
	</div>
{/if}
