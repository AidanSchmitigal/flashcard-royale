<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import {
		getFirestore,
		collection,
		query,
		where,
		getDocs,
		setDoc,
		serverTimestamp,
		doc,

		deleteDoc

	} from 'firebase/firestore';
	import RecommendedDeckCard from '$lib/components/RecommendedDeckCard.svelte';
	import ImportDeckModal from '$lib/components/ImportDeckModal.svelte';
	import { app, db } from '$lib/client/firebase';
	import { type Deck, type Card, type Game, GameState, GameOutcome } from './[gameId]/game';

	let recommendedDecks: Deck[] = [];
	let userDecks: Deck[] = [];
	let showImportModal = false;
	let userId: string | null = null;
	let loading = true;

	// Preview functionality
	let showPreview = false;
	let previewDeck: Deck | null = null;

	onMount(async () => {
		const auth = getAuth(app);
		const db = getFirestore(app);

		// Listen for auth state changes
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				userId = user.uid;
				// Fetch both types of decks once we have the user ID
				await Promise.all([fetchRecommendedDecks(db), fetchUserDecks(db, userId)]);
				loading = false;
			} else {
				// Redirect to login if not authenticated
				window.location.href = '/account/login?redirect=/play';
			}
		});
	});

	async function fetchRecommendedDecks(db: any) {
		try {
			const q = query(collection(db, 'decks'), where('createdBy', '==', '0'));

			const querySnapshot = await getDocs(q);
			recommendedDecks = querySnapshot.docs.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					title: data.title,
					cardCount: data.cardCount || data.cards?.length || 0,
					cards: data.cards || [],
					createdBy: 'Flashcard Royale', // Always "Flashcard Royale" for community decks
					createdAt: data.createdAt
				};
			});
		} catch (error) {
			console.error('Error fetching recommended decks:', error);
			recommendedDecks = [];
		}
	}

	async function fetchUserDecks(db: any, uid: string) {
		try {
			const q = query(collection(db, 'decks'), where('createdBy', '==', uid));

			const querySnapshot = await getDocs(q);
			userDecks = querySnapshot.docs.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					title: data.title,
					cardCount: data.cardCount || data.cards?.length || 0,
					cards: data.cards || [],
					createdBy: 'You', // Display "You" for user's own decks
					createdAt: data.createdAt
				};
			});
		} catch (error) {
			console.error('Error fetching user decks:', error);
			userDecks = [];
		}
	}

	function openImportModal() {
		showImportModal = true;
	}

	function closeImportModal() {
		showImportModal = false;
	}

	function handleImportSuccess(event: CustomEvent<{ cardCount: number }>) {
		// Show a success message (optional)
		const message = `Successfully imported ${event.detail.cardCount} cards!`;
		console.log(message);

		// Close the modal
		closeImportModal();

		// Reload the page to show the new deck
		setTimeout(() => {
			window.location.reload();
		}, 500); // Small delay for better UX
	}

	function openPreview(deck: Deck) {
		previewDeck = deck;
		showPreview = true;
	}

	function deleteDeck(deck: Deck) {
		console.log(deck.id)
		getDocs(query(collection(db, 'decks'), where('id', '==', deck.id))).then((resp) => {
			console.log(resp.docs)
			deleteDoc(resp.docs[0].ref).then(() => fetchUserDecks(db, userId!))
		});
	}

	function closePreview() {
		showPreview = false;
		previewDeck = null;
	}

	async function createAndPlayGame(deck: Deck) {
		try {
			const db = getFirestore(app);
			const gamesCollection = collection(db, 'games');

			// Create new Game object
			const gameData: Game = {
				id: uuidv4(),
				deck: deck,
				createdAt: new Date(),
				createdBy: userId,
				player1: userId,
				player2: null,
				gameState: GameState.Loading,
				player1Hand: null,
				player2Hand: null,
				roundHistory: [],
				roundNumber: 0
			};

			// Add to Firestore with uuid
			await setDoc(doc(db, 'games', gameData.id), gameData);

			// Navigate to the game page
			window.location.href = `/play/${gameData.id}`;
		} catch (error) {
			console.error('Error creating game:', error);
			alert('Failed to start game. Please try again.');
		}
	}
</script>

<div class="mx-auto mt-16 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	{#if loading}
		<div class="flex items-center justify-center py-16">
			<div class="animate-pulse text-center">
				<div class="mx-auto mb-4 h-8 w-56 rounded bg-slate-200"></div>
				<div class="mx-auto h-32 w-full max-w-md rounded bg-slate-200"></div>
			</div>
		</div>
	{:else}
		<!-- User's Decks Section -->
		{#if userId && userDecks.length > 0}
			<section class="mb-12">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-2xl font-semibold text-neutral-800">Your Decks</h2>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each userDecks as deck}
					<div class="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
						<!-- Delete Button -->
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button
						  on:click={() => deleteDeck(deck)}
						  class="absolute top-2 right-2 rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
						<div class="p-5">
							<h3 class="text-lg font-semibold text-neutral-900">{deck.title}</h3>
							<p class="text-sm text-neutral-500">{deck.cardCount} cards</p>
						</div>
						<div class="flex space-x-2 px-5 pb-4">
							<button
								on:click={() => createAndPlayGame(deck)}
								class="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-center text-white hover:bg-indigo-700"
							>
								Play
							</button>
							<button
								on:click={() => openPreview(deck)}
								class="flex-1 rounded-md bg-gray-100 px-4 py-2 text-center text-gray-700 hover:bg-gray-200"
							>
								Preview
							</button>
						</div>
					  </div>
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

			{#if recommendedDecks.length > 0}
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each recommendedDecks as deck}
						<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
							<div class="p-5">
								<h3 class="text-lg font-semibold text-neutral-900">{deck.title}</h3>
								<p class="text-sm text-neutral-500">{deck.cardCount} cards</p>
							</div>
							<div class="flex space-x-2 px-5 pb-4">
								<button
									on:click={() => createAndPlayGame(deck)}
									class="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-center text-white hover:bg-indigo-700"
								>
									Play
								</button>
								<button
									on:click={() => openPreview(deck)}
									class="flex-1 rounded-md bg-gray-100 px-4 py-2 text-center text-gray-700 hover:bg-gray-200"
								>
									Preview
								</button>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="rounded-lg bg-gray-50 py-8 text-center">
					<p class="text-gray-500">No recommended decks available</p>
				</div>
			{/if}
		</section>

		<!-- Create/Import New Deck Section -->
		<section>
			<h2 class="mb-4 text-2xl font-semibold text-gray-800">Import New Deck</h2>
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
	{/if}
</div>

<!-- Card Preview Modal -->
{#if showPreview && previewDeck}
	<div
		transition:fade={{ duration: 150 }}
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
	>
		<div class="max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
			<div class="border-b border-gray-200 p-5">
				<div class="flex items-center justify-between">
					<h3 class="text-xl font-semibold text-gray-800">{previewDeck.title} Preview</h3>
					<button
						on:click={closePreview}
						class="text-gray-500 hover:text-gray-700"
						aria-label="Close preview"
					>
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
			</div>

			<div class="max-h-[60vh] overflow-y-auto p-5">
				{#if previewDeck.cards && previewDeck.cards.length > 0}
					<div class="grid grid-cols-1 gap-4">
						{#each previewDeck.cards as card, index}
							<div class="rounded-lg border border-gray-200 p-4">
								<div class="mb-1 text-sm text-gray-500">Card {index + 1}</div>
								<div class="mb-2">
									<span class="font-medium">Term: </span>
									<span>{card.term}</span>
								</div>
								<div>
									<span class="font-medium">Definition: </span>
									<span>{card.definition}</span>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-center text-gray-500">No cards found in this deck.</p>
				{/if}
			</div>

			<div class="flex justify-end border-t border-gray-200 p-4">
				<button
					on:click={closePreview}
					class="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

{#if showImportModal}
	<div transition:fade={{ duration: 150 }}>
		<ImportDeckModal onClose={closeImportModal} on:import-success={handleImportSuccess} />
	</div>
{/if}
