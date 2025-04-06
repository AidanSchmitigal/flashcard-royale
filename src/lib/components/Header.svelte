<script lang="ts">
	import { user, signOut } from '$lib/client/firebase.svelte';
	import logoSmall from '$lib/images/logo-small.png';
	import { writable } from 'svelte/store';
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
		{#if $user == null}
			<div class="flex items-center gap-4">
				<a
					href="/account/login"
					class="rounded bg-blue-900 px-4 py-2 text-white transition-colors hover:bg-blue-800"
				>
					Sign In
				</a>
				<a
					href="/account/register"
					class="rounded bg-blue-900 px-4 py-2 text-white transition-colors hover:bg-blue-800"
				>
					Register
				</a>
			</div>
		{:else}
			<div class="flex items-center gap-4">
				{#if $user.displayName}
					<p class="font-semibold text-blue-900">Signed in as: {$user.displayName}</p>
				{/if}
				<button
					on:click={signOut}
					class="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
				>
					Sign Out
				</button>
			</div>
		{/if}
	</div>
</header>
