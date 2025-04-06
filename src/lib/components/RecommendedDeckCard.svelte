<!-- src/lib/components/RecommendedDeckCard.svelte -->
<script lang="ts">
	export let deck;

	const difficultyColors = {
		Easy: 'bg-green-100 text-green-800',
		Medium: 'bg-yellow-100 text-yellow-800',
		Hard: 'bg-red-100 text-red-800'
	};
</script>

<div
	class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg"
>
	<div class="p-5">
		<div class="mb-2 flex items-start justify-between">
			<h3 class="truncate text-lg font-semibold text-gray-900">{deck.title}</h3>
			<span
				class={`rounded-full px-2 py-1 text-xs font-medium ${difficultyColors[deck.difficulty]}`}
			>
				{deck.difficulty}
			</span>
		</div>

		<div class="mb-3 flex items-center">
			<span class="text-sm text-gray-500">{deck.cards} cards</span>
			<span class="mx-2 text-gray-300">•</span>
			<span class="text-sm text-gray-500">{deck.category}</span>
		</div>

		<div class="flex space-x-2">
			<a
				href={`/play/${deck.id}`}
				class="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-center font-medium text-white hover:bg-indigo-700"
			>
				Play
			</a>
			<button
				class="flex-1 rounded-md border border-gray-300 px-4 py-2 text-center font-medium text-gray-700 hover:bg-gray-50"
			>
				Preview
			</button>
		</div>
	</div>
</div>
