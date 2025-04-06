import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getUser } from '$lib/client/firebase';

export const load: PageLoad = ({ params }) => {
	const userId = params.user;

	const userData = getUser(userId);

	return {
		user: userData
	};
};
