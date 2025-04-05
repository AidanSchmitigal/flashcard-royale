<!-- src/lib/components/ImportDeckModal.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	export let onClose;

	let importMethod = 'quizlet';
	let quizletLink = '';
	let csvContent = '';
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
		if (importMethod === 'quizlet' && !quizletLink.trim()) {
			error = 'Please enter a valid Quizlet link';
			return;
		}

		if (importMethod === 'csv' && !csvContent.trim() && !file) {
			error = 'Please paste CSV content or upload a file';
			return;
		}

		isProcessing = true;
		error = '';

		try {
			// Here would go the actual import logic
			await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulating API call

			dispatch('import-success', {
				method: importMethod
				// Additional data...
			});

			onClose();
		} catch (err) {
			error = 'Failed to import deck. Please try again.';
		} finally {
			isProcessing = false;
		}
	}
</script>

<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
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
				<button
					class={`px-4 py-2 font-medium ${importMethod === 'csv' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
					on:click={() => (importMethod = 'csv')}
				>
					CSV/Text
				</button>
			</div>

			{#if importMethod === 'quizlet'}
				<div class="space-y-4">
					<label class="block">
						<span class="text-sm font-medium text-gray-700">Quizlet URL</span>
						<input
							type="text"
							bind:value={quizletLink}
							placeholder="https://quizlet.com/..."
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
						/>
					</label>
					<p class="text-sm text-gray-500">
						Paste the URL of any public Quizlet flashcard set to import it.
					</p>
				</div>
			{:else if importMethod === 'csv'}
				<div class="space-y-4">
					<label class="block">
						<span class="text-sm font-medium text-gray-700">Paste CSV Content</span>
						<textarea
							bind:value={csvContent}
							placeholder="term,definition
vocabulary,the words used in a particular context
syntax,the arrangement of words in a sentence"
							class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
							rows="6"
						></textarea>
					</label>

					<div class="flex items-center">
						<span class="text-sm text-gray-500">OR</span>
						<div class="mx-3 flex-grow border-t border-gray-300"></div>
					</div>

					<div class="flex items-center justify-center">
						<label
							class="flex w-full cursor-pointer flex-col items-center rounded-md border border-gray-300 bg-white px-4 py-6 shadow-sm hover:bg-gray-50"
						>
							<svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1.586l-.293-.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 10-1.414-1.414l-.293.293V9z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span class="mt-2 text-base font-medium text-gray-700">
								{file ? file.name : 'Upload CSV file'}
							</span>
							<input type="file" class="hidden" accept=".csv,.txt" on:change={handleFileInput} />
						</label>
					</div>
				</div>
			{/if}

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
