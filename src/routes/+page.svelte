<script lang="ts">
    // Combined imports
    import logo from '$lib/images/logo-transparent.png';
    import logoFallback from '$lib/images/logo-transparent.png';
    import { goto } from '$app/navigation';
</script>

<svelte:head>
    <title>Flashcard Royale - Learn and Compete</title>
    <meta
        name="description"
        content="Drop in. Gear up. Test your knowledge in the ultimate flashcard battle royale experience."
    />
</svelte:head>

<nav class="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-4 bg-white/20 z-50">
    <div class="text-2xl font-bold text-blue-900">Flashcard Royale</div>
    <button class="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">Sign In</button>
</nav>

<section class="flex flex-col justify-center items-center text-center p-16 bg-blue-200 text-blue-900 min-h-screen">
    <div class="logo mb-4">
        <picture>
            <source srcset={logo} type="image/webp" />
            <img src={logoFallback} alt="Battle Royale Logo" class="mx-auto h-24" />
        </picture>
    </div>
    
    <h1 class="text-5xl font-bold mb-4 text-blue-900">Flashcard Royale</h1>

    <h2 class="text-2xl mb-6 text-blue-800">Drop in. Gear up. Fight to be the last one standing.</h2>

    <div class="flex gap-4">
        <a href="/play"
            class="px-6 py-3 text-base font-bold rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors">
            Play Now
        </a>
        <button 
            class="px-6 py-3 text-base font-bold rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
            on:click={() => alert('Leaderboard coming soon!')}>
            Leaderboard
        </button>
    </div>
</section>
