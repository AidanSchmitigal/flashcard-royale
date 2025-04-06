import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { user } from '$lib/client/firebase';
import { get } from 'svelte/store';

export const load: PageLoad = ({ params }) => {
	console.log('THIS IS THE USER DATA', get(user));

	// error(404, 'Not found');
};
