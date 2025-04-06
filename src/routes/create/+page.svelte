<script lang="ts">
    import { onMount } from 'svelte';
    import { auth, db } from '$lib/client/firebase';
    import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
    import { fade, fly } from 'svelte/transition';
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    
    type FlashCard = {
        term: string;
        definition: string;
        id: number;
    };
    
    // Deck information
    let deckTitle = '';
    // Initialize with 5 empty cards
    let cards: FlashCard[] = [
        { term: '', definition: '', id: 0 },
        { term: '', definition: '', id: 1 },
        { term: '', definition: '', id: 2 },
        { term: '', definition: '', id: 3 },
        { term: '', definition: '', id: 4 }
    ];
    let nextId = 5; // Start from 5 since we already have 5 cards
    
    // UI state
    let isSubmitting = false;
    let submitted = false;
    let error: string | null = null;
    import type { User } from 'firebase/auth';
    
    let user = writable<User | null>(null);
    
    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            user.set(currentUser);
            if (!currentUser) {
                // Redirect to login if not authenticated
                window.location.href = '/account/login?redirect=/create';
            }
        });
        return unsubscribe;
    });
    
    // Add a new blank card
    function addCard() {
        cards = [...cards, { term: '', definition: '', id: nextId }];
        nextId++;
    }
    
    // Remove a card by its id - only if we have more than 5 cards
    function removeCard(id: number) {
        if (cards.length > 5) {
            cards = cards.filter(card => card.id !== id);
        }
    }
    
    // Save the deck to Firebase
    async function saveDeck() {
        if (!$user) {
            error = "You must be logged in to save a deck";
            return;
        }
        
        if (!deckTitle.trim()) {
            error = "Please enter a deck title";
            return;
        }
        
        if (cards.length < 5) {
            error = "Your deck needs at least 5 cards";
            return;
        }
        
        // Validate that all cards have content
        const emptyCards = cards.filter(card => !card.term.trim() || !card.definition.trim());
        if (emptyCards.length > 0) {
            error = "All cards must have both a term and definition";
            return;
        }
        
        try {
            isSubmitting = true;
            error = null;
            
            // Prepare deck object
            const deckData = {
                title: deckTitle,
                createdBy: $user.uid,
                createdAt: serverTimestamp(),
                cardCount: cards.length,
                cards: cards.map(({ term, definition }) => ({ term, definition }))
            };
            
            // Save to Firestore
            const docRef = await addDoc(collection(db, "decks"), deckData);
            
            // Success!
            submitted = true;
            
            // Redirect to play page after a short delay
            setTimeout(() => {
                goto('/play');
            }, 1500);
            
        } catch (e) {
            console.error("Error adding deck: ", e);
            error = "Failed to save deck. Please try again.";
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 mt-12">
    <h1 class="text-3xl font-bold text-blue-900 mb-8">Create New Deck</h1>
    
    {#if submitted}
        <div 
            class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
            transition:fade={{ duration: 300 }}
        >
            <p>Deck successfully created!</p>
        </div>
    {/if}
    
    {#if error}
        <div 
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
            transition:fade={{ duration: 300 }}
        >
            <p>{error}</p>
        </div>
    {/if}
    
    <form on:submit|preventDefault={saveDeck} class="space-y-8">
        <!-- Deck Information -->
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4">Deck Information</h2>
            
            <div>
                <label for="deckTitle" class="block text-gray-700 mb-1">Deck Title*</label>
                <input 
                    type="text"
                    id="deckTitle"
                    bind:value={deckTitle}
                    class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Spanish Vocabulary"
                    required
                />
            </div>
        </div>
        
        <!-- Flashcards -->
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Flashcards</h2>
                <span class="text-gray-500">{cards.length} card{cards.length !== 1 ? 's' : ''} (minimum 5)</span>
            </div>
            
            {#each cards as card (card.id)}
                <div 
                    class="card-item border rounded-md p-4 mb-4 bg-gray-50"
                    transition:fly={{ y: 10, duration: 200 }}
                >
                    <div class="flex justify-between mb-2">
                        <h3 class="font-medium">Card #{card.id + 1}</h3>
                        {#if cards.length > 5}
                            <button 
                                type="button" 
                                on:click={() => removeCard(card.id)}
                                class="text-red-500 hover:text-red-700"
                                aria-label="Remove card"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        {/if}
                    </div>
                    
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label for="term-{card.id}" class="block text-gray-700 mb-1">Term</label>
                            <input 
                                id="term-{card.id}"
                                type="text"
                                bind:value={card.term}
                                class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter term"
                            />
                        </div>
                        
                        <div>
                            <label for="definition-{card.id}" class="block text-gray-700 mb-1">Definition</label>
                            <textarea 
                                id="definition-{card.id}"
                                bind:value={card.definition}
                                class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                                placeholder="Enter definition"
                            ></textarea>
                        </div>
                    </div>
                </div>
            {/each}
            
            <button 
                type="button"
                on:click={addCard}
                class="w-full py-2 mt-2 border-2 border-dashed border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
            >
                <div class="flex items-center justify-center">
                    <svg class="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                    </svg>
                    Add Card
                </div>
            </button>
        </div>
        
        <!-- Submit Button -->
        <div class="flex justify-end">
            <button 
                type="submit"
                class="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
            >
                {#if isSubmitting}
                    <span class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Saving...
                    </span>
                {:else}
                    Save Deck
                {/if}
            </button>
        </div>
    </form>
</div>
