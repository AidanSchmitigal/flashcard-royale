<script lang="ts">
	import confetti from 'canvas-confetti';

	// About us page component

	function launchConfetti() {
		confetti({
			particleCount: 150,
			spread: 70,
			origin: { y: 0.6 }
		});
	}
</script>

<svelte:head>
	<title>Contact Us - Flashcard Royale</title>
	<meta name="description" content="Learn about the team behind Flashcard Royale" />
</svelte:head>

<div class="mx-auto max-w-3xl p-8 text-blue-900">
	<h1 class="mb-8 text-center text-3xl font-bold text-blue-800">Contact Us</h1>

	<section class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-blue-700">Oscar Ludwig</h2>
		<p class="leading-relaxed">
			<a href="mailto:oscar.ludwig@icloud.com" class="text-blue-600 hover:underline"
				>oscar.ludwig@icloud.com</a
			>
		</p>
	</section>

	<section class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-blue-700">Aidan Schmitigal</h2>
		<p class="leading-relaxed">
			<button onclick={launchConfetti} class="text-blue-600 hover:underline">email.com</button>
		</p>
	</section>

	<section class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-blue-700">Kai</h2>
		<p class="leading-relaxed">
			<a href="mailto:turnekai@oregonstate.edu" class="text-blue-600 hover:underline"
				>turnekai@oregonstate.edu</a
			>
		</p>
	</section>

	<section class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-blue-700">Sam</h2>
		<p class="leading-relaxed">
			<a href="mailto:turnekai@oregonstate.edu" class="text-blue-600 hover:underline"
				>turnekai@oregonstate.edu</a
			>
		</p>
	</section>
</div>
