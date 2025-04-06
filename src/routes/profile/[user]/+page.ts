import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getUser } from '$lib/client/firebase';

export const load: PageLoad = async ({ params }) => {
	const userId = params.user;

	const userData = await getUser(userId); 

	if (!userData) {
		throw error(404, 'User not found');
	}

	return {
		user: userData
	};
};
