<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';
</script>

<div class="app-container">
	<header
		class="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-white/20 px-8 py-4"
	>
		<h1 class="text-2xl font-bold text-blue-900">Flashcard Royale</h1>
		<div>
			<button class="rounded bg-blue-900 px-4 py-2 text-white transition-colors hover:bg-blue-800">
				Sign In
			</button>
		</div>
	</header>

	<main>
		<slot />
	</main>

	<Footer />
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
		min-height: 100vh;
	}

	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
	}
</style>
