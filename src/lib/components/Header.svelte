<script lang="ts">
	import { auth } from '$lib/client/firebase';
</script>

<header class="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-4 bg-white/20 z-50">
    <h1 class="text-2xl font-bold text-blue-900">Flashcard Royale</h1>
    <div>
        {#if auth.currentUser != null}
        <a href="/account/login" class="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">
            Sign In
        </a>
        <a href="/account/login" class="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">
            Register
        </a>
        {:else}
        <p class="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">
            You are signed in
        </p>
        {/if}
    </div>
</header>
