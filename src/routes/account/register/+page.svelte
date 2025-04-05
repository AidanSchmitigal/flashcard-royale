<script lang="ts">
	import type { ActionData } from './$types';
	import { page } from '$app/state';
	import { auth, db } from '$lib/client/firebase';
	import { createUserWithEmailAndPassword } from '@firebase/auth';
	import { addDoc, collection } from '@firebase/firestore';

	export let form: ActionData | null = null;

	let name = form?.name ?? '';
	let email = form?.email ?? '';
	let password = '';
	let passwordConfirm = '';
	let submitButton: HTMLButtonElement;

	$: firstName =
		name.toString().split(' ')[0].slice(0, 1).toUpperCase() +
		name.toString().split(' ')[0].slice(1).toLowerCase();
	const redirect = page.url.searchParams.get('redirect');

	function register() {
		submitButton.disabled = true;

		createUserWithEmailAndPassword(auth, email, password)
			.then(async (currentUser) => {
				await addDoc(collection(db, "users"), {
					id: currentUser.user.uid,
					name: name
				});

				window.location.assign('/');
			}) .catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage)
			});
	}
</script>

<svelte:head>
	<title>Register | Flashcard Royale</title>
</svelte:head>

<div class="pattern-bathroom-floor-amber-100 flex h-screen items-center justify-center">
	<div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
		<a href={`/${page.url.searchParams.get('redirect') ?? ''}`} class="group text-amber-500">
			<span class="inline-block transition-transform group-hover:-translate-x-1">←</span>&nbsp;Back
		</a>
		<h1 class="mb-4 text-3xl font-bold">Register</h1>
		<form data-form-type="register">
			{#if form}
				<p class="mb-4 whitespace-break-spaces text-red-500">{form.message}</p>
			{/if}
			<label for="name" class="mb-2 block">Display Name</label>
			<input
				bind:value={name}
				required
				type="text"
				name="name"
				minlength="2"
				maxlength="150"
				id="name"
				class="w-full rounded-lg border px-3 py-2"
			/>
			<span class="mb-4 block w-full py-2 text-sm text-gray-400"
				>{name ? `First Name: ${firstName}` : ''}</span
			>
			<label for="email" class="mb-2 block">Email</label>
			<input
				bind:value={email}
				on:input={(event) =>
					event.currentTarget.value.length > 5 ? event.currentTarget.reportValidity() : null}
				required
				type="email"
				name="email"
				id="email"
				class="mb-4 w-full rounded-lg border px-3 py-2 lowercase"
			/>
			<label for="password" class="mb-2 block"
				>Password <span class="text-sm text-gray-400">(minimum 5 characters)</span></label
			>
			<input
				bind:value={password}
				required
				type="password"
				name="password"
				minlength="5"
				maxlength="72"
				id="password"
				class="w-full rounded-lg border px-3 py-2"
			/>
			<span class="mb-4 block w-full py-2 text-lg text-gray-400">
				{#if password.length > 10}
					{'🎉'.repeat(password.length / 10)}{'🏋️'.repeat(password.length / 2)}{'🎉'.repeat(
						password.length / 10
					)}
				{:else}
					{password ? '🏋️'.repeat(password.length / 2) : ''}
				{/if}
			</span>
			<label for="passwordConfirm" class="mb-2 block">Confirm Password</label>
			<input
				bind:value={passwordConfirm}
				required
				type="password"
				name="passwordConfirm"
				minlength="5"
				maxlength="72"
				id="passwordConfirm"
				class="w-full rounded-lg border px-3 py-2"
			/>
			<span class="mb-4 block w-full py-2 text-sm text-gray-400"
				>{password && passwordConfirm
					? password === passwordConfirm
						? 'Good :)'
						: 'Passwords must match'
					: ''}</span
			>
			<button
				bind:this={submitButton}
				on:click={() => register()}
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
				Register
			</button>
		</form>
		<p class="mt-4 text-center">
			Already have an account? <a
				href="/account/login{redirect ? '?redirect=' + redirect : ''}"
				class="text-amber-500 hover:underline">Login here</a
			>
		</p>
	</div>
</div>
