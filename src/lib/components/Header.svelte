<script lang="ts">
	import { auth } from '$lib/client/firebase';
	import logoSmall from '$lib/images/logo-small.png';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { signOut } from 'firebase/auth';


	const user = writable<null | object>(null); // store to track auth state

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((currentUser) => {
			user.set(currentUser);
		});

		return () => unsubscribe(); // cleanup
	});

	function handleSignOut() {
	signOut(auth)
		.then(() => {
			user.set(null);
		})
		.catch((error) => {
			console.error('Error signing out:', error);
		});
}
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
				<p class="text-blue-900 font-semibold">You are signed in</p>
				<button
					on:click={handleSignOut}
					class="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
				>
					Sign Out
				</button>
			</div>
		{/if}
<<<<<<< HEAD
=======
		</div>
>>>>>>> 7e42b9e67c4af43574f83b85c2bd50df88e69733
</header>
