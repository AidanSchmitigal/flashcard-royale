<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { ActionData } from './$types';

	export let form: ActionData | null = null;

	import type { PageData } from './$types';
	export let data: PageData;

	let submitButton: HTMLButtonElement;
	const redirect = page.url.searchParams.get('redirect');
</script>

<svelte:head>
	<title>Login | Flashcard Royale</title>
</svelte:head>

<div class="pattern-bathroom-floor-amber-100 flex h-screen items-center justify-center">
	<div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
		{#if form?.success || data.loggedIn}
			<div class="flex flex-col items-center">
				<h1 class="mb-4 text-2xl font-bold">You are logged in. 👍</h1>
				<a href="/" class="rounded bg-amber-500 px-4 py-2 font-bold text-white hover:bg-amber-700"
					>Home</a
				>
			</div>
		{:else}
			<a href={`/${page.url.searchParams.get('redirect') ?? ''}`} class="group text-amber-500">
				<span class="inline-block transition-transform group-hover:-translate-x-1">←</span
				>&nbsp;Back
			</a>
			<h1 class="mb-4 text-3xl font-bold">Login</h1>
			<form
				method="POST"
				data-form-type="login"
				use:enhance={() => {
					submitButton.disabled = true;
					return async ({ update }) => {
						await update();
						if (!form?.success) submitButton.disabled = false;
					};
				}}
			>
				{#if form}
					<p class="mb-4 text-red-500">{form.message}</p>
				{/if}
				<label for="email" class="mb-2 block">Email</label>
				<input
					type="text"
					name="email"
					id="email"
					value={form?.email || ''}
					class="mb-4 w-full rounded-lg border px-3 py-2 lowercase"
				/>
				<label for="password" class="mb-2 block">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					class="mb-4 w-full rounded-lg border px-3 py-2"
				/>
				<button
					bind:this={submitButton}
					type="submit"
					class="group flex items-center rounded bg-amber-500 px-4 py-2 font-bold text-white hover:bg-amber-700 disabled:bg-gray-400"
				>
					<svg
						class="mr-3 hidden h-5 w-5 animate-spin group-disabled:block"
						xmlns="http://www.w3.org/2000/svg"
						width="100"
						height="100"
						viewBox="0 0 100 100"
						fill="none"
					>
						<path
							d="M3.16724 32.4874C6.63092 23.2247 12.7635 15.1972 20.7895 9.41987C28.8155 3.64257 38.3744 0.375007 48.2575 0.0303724C58.1406 -0.314263 67.9039 2.27951 76.3128 7.4837C84.7217 12.6879 91.3986 20.2687 95.4991 29.2676L80.0341 36.3145C77.3274 30.3743 72.9199 25.3702 67.3692 21.9349C61.8184 18.4996 55.3736 16.7874 48.8498 17.0149C42.3259 17.2424 36.016 19.3993 30.7181 23.2129C25.4201 27.0265 21.3719 32.3255 19.0855 38.4398L3.16724 32.4874Z"
							fill="white"
						/>
						<path
							d="M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50ZM17 50C17 68.2254 31.7746 83 50 83C68.2254 83 83 68.2254 83 50C83 31.7746 68.2254 17 50 17C31.7746 17 17 31.7746 17 50Z"
							fill="white"
							fill-opacity="0.5"
						/>
					</svg>
					Login
				</button>
			</form>
			<p class="mt-4 text-center">
				Need an account? <a
					href="/account/register{redirect ? '?redirect=' + redirect : ''}"
					class="text-amber-500 hover:underline">Register here</a
				>
			</p>
		{/if}
	</div>
</div>
