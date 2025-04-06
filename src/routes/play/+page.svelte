<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
    import RecommendedDeckCard from '$lib/components/RecommendedDeckCard.svelte';
    import ImportDeckModal from '$lib/components/ImportDeckModal.svelte';
    import { app } from '$lib/client/firebase';

    // Interface for deck structure
    interface Deck {
        id: string;
        title: string;
        cardCount: number;
        cards: any[];
        createdBy: string;
        createdAt: any;
    }

    // Interface for card structure
    interface Card {
        id: string;
        term: string;
        definition: string;
        base_health?: number;
        base_dmg?: number;
    }

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
                await Promise.all([
                    fetchRecommendedDecks(db),
                    fetchUserDecks(db, userId)
                ]);
                loading = false;
            } else {
                // Redirect to login if not authenticated
                window.location.href = '/account/login?redirect=/play';
            }
        });
    });

    async function fetchRecommendedDecks(db: any) {
        try {
            const q = query(
                collection(db, "decks"),
                where("createdBy", "==", "0")
            );
            
            const querySnapshot = await getDocs(q);
            recommendedDecks = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    cardCount: data.cardCount || (data.cards?.length || 0),
                    cards: data.cards || [],
                    createdBy: "Flashcard Royale", // Always "Flashcard Royale" for community decks
                    createdAt: data.createdAt
                };
            });
        } catch (error) {
            console.error("Error fetching recommended decks:", error);
            recommendedDecks = [];
        }
    }

    async function fetchUserDecks(db: any, uid: string) {
        try {
            const q = query(
                collection(db, "decks"),
                where("createdBy", "==", uid)
            );
            
            const querySnapshot = await getDocs(q);
            userDecks = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    cardCount: data.cardCount || (data.cards?.length || 0),
                    cards: data.cards || [],
                    createdBy: "You", // Display "You" for user's own decks
                    createdAt: data.createdAt
                };
            });
        } catch (error) {
            console.error("Error fetching user decks:", error);
            userDecks = [];
        }
    }

    function openImportModal() {
        showImportModal = true;
    }

    function closeImportModal() {
        showImportModal = false;
    }
    
    function handleImportSuccess(event) {
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
    
    function closePreview() {
        showPreview = false;
        previewDeck = null;
    }
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    {#if loading}
        <div class="flex justify-center items-center py-16">
            <div class="animate-pulse text-center">
                <div class="h-8 bg-slate-200 rounded w-56 mx-auto mb-4"></div>
                <div class="h-32 bg-slate-200 rounded w-full max-w-md mx-auto"></div>
            </div>
        </div>
    {:else}
        <!-- User's Decks Section -->
        {#if userId && userDecks.length > 0}
            <section class="mb-12">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-2xl font-semibold text-neutral-800">Your Decks</h2>
                    <a href="/decks" class="font-medium text-indigo-600 hover:text-indigo-800">View All</a>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {#each userDecks as deck}
                        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                            <div class="p-5">
                                <h3 class="text-lg font-semibold text-neutral-900">{deck.title}</h3>
                                <p class="text-sm text-neutral-500">{deck.cardCount} cards</p>
                            </div>
                            <div class="px-5 pb-4 flex space-x-2">
                                <a 
                                    href={`/game/${deck.id}`} 
                                    class="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700"
                                >
                                    Play
                                </a>
                                <button 
                                    on:click={() => openPreview(deck)} 
                                    class="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200"
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
                        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                            <div class="p-5">
                                <h3 class="text-lg font-semibold text-neutral-900">{deck.title}</h3>
                                <p class="text-sm text-neutral-500">{deck.cardCount} cards</p>
                            </div>
                            <div class="px-5 pb-4 flex space-x-2">
                                <a 
                                    href={`/game/${deck.id}`} 
                                    class="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700"
                                >
                                    Play
                                </a>
                                <button 
                                    on:click={() => openPreview(deck)} 
                                    class="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-200"
                                >
                                    Preview
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="text-center py-8 bg-gray-50 rounded-lg">
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
                            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"></path>
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
    <div transition:fade={{ duration: 150 }} class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div class="p-5 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-gray-800">{previewDeck.title} Preview</h3>
                    <button on:click={closePreview} class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="p-5 overflow-y-auto max-h-[60vh]">
                {#if previewDeck.cards && previewDeck.cards.length > 0}
                    <div class="grid grid-cols-1 gap-4">
                        {#each previewDeck.cards as card, index}
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="text-sm text-gray-500 mb-1">Card {index + 1}</div>
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
            
            <div class="p-4 border-t border-gray-200 flex justify-end">
                <button 
                    on:click={closePreview} 
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}

{#if showImportModal}
    <div transition:fade={{ duration: 150 }}>
        <ImportDeckModal 
            onClose={closeImportModal} 
            on:import-success={handleImportSuccess}
        />
    </div>
{/if}