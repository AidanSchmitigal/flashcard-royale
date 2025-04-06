<script lang="ts">
	import { auth } from '$lib/client/firebase';
	import logoSmall from '$lib/images/logo-small.png';
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-white/20 px-8 py-4"
>
	<div class="flex items-center">
		<a href="/" class="flex items-center">
			<picture>
				<source srcset={logoSmall} type="image/webp" />
				<img src={logoSmall} alt="Flashcard Royale" class="mr-2 h-10" />
			</picture>
			<span class="text-2xl font-bold text-blue-900">Flashcard Royale</span>
		</a>
	</div>

	<div>
		{#if auth.currentUser == null}
			<a
				href="/account/login"
				class="rounded bg-blue-900 px-4 py-2 text-white transition-colors hover:bg-blue-800"
			>
				Sign In
			</a>
			<a
				href="/account/login"
				class="rounded bg-blue-900 px-4 py-2 text-white transition-colors hover:bg-blue-800"
			>
				Register
			</a>
		{:else}
			<p class="rounded bg-blue-900 px-4 py-2 text-white transition-colors hover:bg-blue-800">
				You are signed in
			</p>
		{/if}
	</div>
</header>
