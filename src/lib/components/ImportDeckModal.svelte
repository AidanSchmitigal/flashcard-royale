<!-- src/lib/components/ImportDeckModal.svelte -->
<script lang="ts">
	import { auth } from '$lib/client/firebase';
	import { createDeck } from '$lib/client/game/data';
	import { gen_url, get_cards, parse_url } from '$lib/client/quizlet/request_quizlet';
	import { processFlashcards } from '$lib/client/statsLLM';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';

	export let onClose;

	let importMethod = 'quizlet';
	let quizletLink = '';
	let quizletData = '';
	let file = null;
	let isProcessing = false;
	let error = '';

	const dispatch = createEventDispatcher();

	function handleFileInput(event) {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			file = selectedFile;
			// Read the file if needed
		}
	}

	async function handleImport() {
		if (auth.currentUser == null) {
			error = 'Please sign in';
			return;
		}

		isProcessing = true;
		error = '';

		//try {
			if (importMethod === 'quizlet') {
				const cardsJson = get_cards(quizletData)
				const cards = await processFlashcards(cardsJson)
				createDeck({ id: uuidv4(), ownersIds: auth.currentUser ? [auth.currentUser.uid] : [], cards: cards })
			}

			// ?
			dispatch('import-success', {
				method: importMethod
				// Additional data...
			});

			// onClose();
		//} catch (err) {
		//	error = 'Failed to import deck. Please try again.';
		//} finally {
		//	isProcessing = false;
		//}
	}

	function openQuizletUrl() {
		let parsed
		try {
			parsed = parse_url(quizletLink)!
		} catch {
			// This doesn't trigger
			error = 'Failed to parse'
			return
		}

		window.open(gen_url(parsed))?.focus()
	}
</script>

<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="w-full max-w-md rounded-lg bg-white shadow-xl"
		on:click|stopPropagation
		transition:slide={{ duration: 200 }}
	>
		<div class="flex items-center justify-between border-b p-5">
			<h2 class="text-xl font-semibold text-gray-900">Import New Deck</h2>
			<button on:click={onClose} class="text-gray-400 hover:text-gray-600" aria-label="Close">
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					></path>
				</svg>
			</button>
		</div>

		<div class="p-5">
			<!-- Import Method Tabs -->
			<div class="mb-5 flex border-b">
				<button
					class={`px-4 py-2 font-medium ${importMethod === 'quizlet' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
					on:click={() => (importMethod = 'quizlet')}
				>
					Quizlet Link
				</button>
			</div>

			<div class="space-y-4">
				<label class="block">
					<span class="text-sm font-medium text-gray-700">Quizlet URL</span>
					<input
						type="text"
						bind:value={quizletLink}
						placeholder="https://quizlet.com/..."
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
					/>
					<button
						on:click={openQuizletUrl}
						class="flex items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
						disabled={isProcessing}
					>Open Data</button>
					<span class="text-sm font-medium text-gray-700">Quizlet Data</span>
					<input
						type="text"
						bind:value={quizletData}
						placeholder={"{\"response..."}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
					/>
				</label>
				<p class="text-sm text-gray-500">
					Paste the URL of any public Quizlet flashcard set to import it.
				</p>
			</div>

			{#if error}
				<div class="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			{/if}
		</div>

		<div class="flex justify-end space-x-3 border-t px-5 py-4">
			<button
				on:click={onClose}
				class="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
				disabled={isProcessing}
			>
				Cancel
			</button>
			<button
				on:click={handleImport}
				class="flex items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
				disabled={isProcessing}
			>
				{#if isProcessing}
					<svg class="mr-2 -ml-1 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Importing...
				{:else}
					Import Deck
				{/if}
			</button>
		</div>
	</div>
</div>
