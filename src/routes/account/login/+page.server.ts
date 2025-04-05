import { type ActionFailure, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// Auto redirect to home if logged in
export const load: PageServerLoad = async ({ route }) => {
	// check if user is logged in
	return {
		loggedIn: false
	};
};

export const actions: Actions = {
	default: async ({
		request,
		url
	}): Promise<
		{ success: boolean } | ActionFailure<{ email: FormDataEntryValue; message: string }>
	> => {
		const body = Object.fromEntries(await request.formData());
		const name = body.name as string;
		const email = body.email.toString().toLowerCase();
		const password = body.password as string;
		const loginError = false;

		// TODO: Check firebase auth

		// const loginError = await locals.pb
		// 	.collection('users')
		// 	.authWithPassword(body.email.toString().toLowerCase(), body.password as string)
		// 	.then(() => null)
		// 	.catch((err) => {
		// 		if (err.status === 400)
		// 			return fail(400, {
		// 				email: body.email.toString().toLowerCase(),
		// 				message: 'Invalid email or password (Login)'
		// 			});
		// 		if (err.status === 403)
		// 			return fail(403, {
		// 				email: body.email.toString().toLowerCase(),
		// 				message: 'Sign ups temporarily disabled (Login)'
		// 			});
		// 		return fail(500, {
		// 			email: body.email.toString().toLowerCase(),
		// 			message: 'Server error. Please try again later. (Login)'
		// 		});
		// 	});

		if (loginError) return loginError;
		if (url.searchParams.has('redirect'))
			redirect(303, `/${url.searchParams.get('redirect') || ''}`);
		return { success: true };

		throw redirect(303, '/');
	}
} satisfies Actions;
