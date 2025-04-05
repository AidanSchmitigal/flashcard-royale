<script lang="ts">
	// import logo from '$lib/images/battle-royale-logo.webp';
	// import logoFallback from '$lib/images/battle-royale-logo.png';
</script>

<svelte:head>
	<title>Battle Royale - Dominate the Arena</title>
	<meta
		name="description"
		content="Drop in. Gear up. Survive the battlefield in the ultimate battle royale experience."
	/>
</svelte:head>

<section class="hero">
	<h1>
		<span class="logo">
			<!-- <picture>
				<source srcset={logo} type="image/webp" />
				<img src={logoFallback} alt="Battle Royale Logo" />
			</picture> -->
		</span>
	</h1>

	<h2 class="tagline">Drop in. Gear up. Fight to be the last one standing.</h2>

	<div class="cta">
		<button on:click={() => alert('Matchmaking coming soon!')}>Play Now</button>
		<button on:click={() => alert('Check back soon!')}>Learn More</button>
	</div>
</section>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 4rem 1rem;
		background: linear-gradient(to bottom, #111 0%, #1a1a1a 100%);
		color: #f0f0f0;
		min-height: 100vh;
	}

	h1 {
		margin-bottom: 1rem;
	}

	.logo {
		display: block;
		width: 80%;
		max-width: 600px;
		position: relative;
	}

	.logo img {
		width: 100%;
		height: auto;
		display: block;
	}

	.tagline {
		font-size: 1.5rem;
		margin: 1.5rem 0;
		color: #ffce00;
	}

	.cta {
		display: flex;
		gap: 1rem;
	}

	button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: bold;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		background-color: #ff4444;
		color: white;
		transition: background 0.3s;
	}

	button:hover {
		background-color: #cc0000;
	}
</style>
