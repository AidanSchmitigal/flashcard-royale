import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ route }) => {
	// check if user is logged in
	return {
		loggedIn: false
	};
};
