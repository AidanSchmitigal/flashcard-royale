// src/hooks.server.js
import { auth } from '$lib/client/firebase.svelte';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.locals.auth = auth;
	const response = await resolve(event);

	return response;
}
