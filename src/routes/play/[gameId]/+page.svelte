<script lang="ts">
    import { onMount } from 'svelte';
    import { mockDeck } from '$lib/game/mockDeck';
    import { createCardFromFlashcard } from '$lib/game/index';
    import { BattleManager } from '$lib/game/manager';
    import { validateAnswer } from '$lib/game/validation';
    import { fade, fly } from 'svelte/transition';

    let battle: BattleManager;
    let currentCardTerm = '';
    let currentCardDef = '';
    let userInput = '';
    let logs: string[] = [];
    let gameOver = false;
    
    // Track active cards in battle
    let playerCards: any[] = [];
    let enemyCards: any[] = [];
    
    // Added feedback variables
    let showFeedback = false;
    let isCorrect = false;
    let correctAnswer = '';
    let promptShown = '';
    
    // Animation states
    let cardTakingDamage = '';
    let playerTakingDamage = false;

    // Track cards that have been correctly answered
    let activatedCardIds = new Set<string | number>();

    // Flag to track when we've just changed to a new card (due to death or wrong answer)
    let justChangedCard = false;

    onMount(() => {
        // Initialize battle
        playerCards = mockDeck.map((c) => createCardFromFlashcard(c.term, c.definition, c.health, c.damage));
        enemyCards = mockDeck.map((c) => createCardFromFlashcard(c.term, c.definition, c.health, c.damage));
        battle = new BattleManager(playerCards, enemyCards);
        
        // Sync our local arrays with battle manager's state
        playerCards = battle.getPlayerCards();
        enemyCards = battle.getEnemyCards();
        
        loadCurrentPrompt();
    });

    function loadCurrentPrompt() {
        const attacker = battle.getCurrentAttacker();
        
        // Skip prompt if the card was already answered correctly
        if (battle.isCardAnsweredCorrectly(attacker.id)) {
            // Auto-process the turn for correctly answered cards
            processTurnWithoutInput(true);
            return;
        }
        
        // Always ask for the term and provide the definition
        promptShown = attacker.definition;
        correctAnswer = attacker.term;
        
        currentCardTerm = promptShown;
        showFeedback = false;
        cardTakingDamage = '';
    }
    
    function processTurnWithoutInput(correct: boolean) {
        // Process turn with the result
        const result = battle.processTurn(correct);
        logs = [result.log, ...logs];
        
        // Mark the target card for damage animation
        if (correct) {
            cardTakingDamage = result.targetId ? String(result.targetId) : '';
        }
        
        // Mark player card for damage animation if it took damage
        if (result.playerTookDamage) {
            playerTakingDamage = true;
        }
        
        // After a short delay, update UI and move to next prompt or end game
        setTimeout(() => {
            playerTakingDamage = false;
            
            if (result.done) {
                gameOver = true;
            } else {
                // Update our local arrays with battle manager's state
                playerCards = battle.getPlayerCards();
                enemyCards = battle.getEnemyCards();
                
                // Sync activated cards set with battle manager's state
                activatedCardIds = new Set(battle.correctlyAnsweredCardIds);
                
                if (result.needNewPrompt) {
                    // Player needs to answer for the new card
                    loadCurrentPrompt();
                } else {
                    // Continue with the next turn immediately if no new prompt needed
                    processTurnWithoutInput(true);
                }
            }
        }, correct ? 1000 : 2000); // Shorter delay for auto-attacks
    }

    function handleSubmit() {
        // Validate the answer and show feedback
        isCorrect = validateAnswer(userInput, correctAnswer);
        showFeedback = true;
        
        userInput = '';
        
        // After feedback delay, process the turn
        setTimeout(() => {
            processTurnWithoutInput(isCorrect);
        }, 1500);
    }
</script>

{#if !gameOver}
    <div class="mx-auto flex h-screen w-fit flex-col justify-center">
        <div class="flex items-center gap-16">
            <!-- Player cards -->
            <div class="flex flex-row-reverse gap-4">
                {#each playerCards as card, i (`player-${i}-${card.id}`)}
                    <div class="mb-4 bg-amber-100 p-4 rounded shadow-sm relative" 
                         class:ring-2={i === 0} 
                         class:ring-blue-500={i === 0}
                         class:bg-green-100={battle.isCardAnsweredCorrectly(card.id)}
                         class:animate-pulse={i === 0 && playerTakingDamage}
                         transition:fade>
                        <p class="text-lg">{card.term.substring(0, 4)}</p>
                        <div class="flex justify-between mt-2 text-sm gap-6">
                            <span class="text-red-600">❤️ {card.hp}</span>
                            <span class="text-blue-600">⚔️ {card.damage}</span>
                        </div>
                        {#if i === 0}
                            <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-0.5 text-xs rounded-full">
                                Active
                            </div>
                        {/if}
                        {#if battle.isCardAnsweredCorrectly(card.id)}
                            <div class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                ✓
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
            
            <div>VS.</div>
            
            <!-- Enemy cards -->
            <div class="flex gap-4">
                {#each enemyCards as card, i (`enemy-${i}-${card.id}`)}
                    <div class="mb-4 bg-amber-100 p-4 rounded shadow-sm relative"
                         class:ring-2={i === 0} 
                         class:ring-red-500={i === 0}
                         class:animate-pulse={cardTakingDamage === card.id}
                         transition:fade>
                        <p class="text-lg">{card.definition.substring(0, 4)}</p>
                        <div class="flex justify-between mt-2 text-sm gap-6">
                            <span class="text-red-600">❤️ {card.hp}</span>
                            <span class="text-blue-600">⚔️ {card.damage}</span>
                        </div>
                        {#if i === 0}
                            <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                                Target
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
        
        <!-- Card and input section -->
        <div class="mx-auto flex gap-16">
            <div class="h-48 w-96 rounded-md bg-white shadow-lg flex flex-col items-center justify-center">
                <p class="text-xl mb-2">{currentCardTerm}</p>
                
                <!-- Feedback section -->
                {#if showFeedback}
                    <div class={`mt-4 p-2 rounded ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                        <p class="font-bold">{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</p>
                        {#if !isCorrect}
                            <p class="text-sm mt-1">Correct answer: {correctAnswer}</p>
                        {/if}
                    </div>
                {/if}
            </div>
            
            <form on:submit|preventDefault={handleSubmit} class="mb-4 flex h-48 w-96 flex-col">
                <input
                    bind:value={userInput}
                    placeholder="Type your answer..."
                    class="mb-2 h-full w-full border px-4 py-2"
                    disabled={showFeedback}
                />
                <button type="submit" class="rounded bg-blue-600 px-4 py-2 text-white" disabled={showFeedback}>
                    Attack!
                </button>
            </form>
        </div>
        
        <!-- Battle log -->
        <div class="mt-8 max-h-32 overflow-y-auto w-96 mx-auto">
            <h3 class="font-bold mb-2">Battle Log:</h3>
            {#each logs as log, i}
                <p class="text-sm" class:font-bold={i === 0}>{log}</p>
            {/each}
        </div>
    </div>
{:else}
    <div class="mx-auto max-w-xl p-8 text-center">
        <h2 class="text-3xl font-bold">{playerCards.length > 0 ? '🎉 Victory!' : '😢 Defeat!'}</h2>
        <p class="mt-4">{playerCards.length > 0 ? 'You defeated all enemy cards!' : 'All your cards were defeated!'}</p>
        <button class="mt-8 rounded bg-blue-600 px-4 py-2 text-white" on:click={() => window.location.href = "/"}>
            Return to Home
        </button>
    </div>
{/if}