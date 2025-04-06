<!-- src/lib/components/RecentDeckCard.svelte -->
<script lang="ts">
	export let deck;

	function formatDate(dateString) {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}).format(date);
	}
</script>

<div
	class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg"
>
	<div class="p-5">
		<h3 class="mb-1 truncate text-lg font-semibold text-gray-900">{deck.title}</h3>
		<p class="mb-3 text-sm text-gray-500">
			{deck.cards} cards • Last played {formatDate(deck.lastPlayed)}
		</p>

		<div class="flex space-x-2">
			<a
				href={`/play/${deck.id}`}
				class="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-center font-medium text-white hover:bg-indigo-700"
			>
				Play
			</a>
			<button
				class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
				aria-label="Deck options"
			>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
					></path>
				</svg>
			</button>
		</div>
	</div>
</div>
