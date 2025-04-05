// import { Collections } from '$lib/database/types.js';
// import { createBook, createUser, handlePBError, type HandledPBError } from '$lib/database/utils.js';
import { type ActionFailure, fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({
		request,
		url
	}): Promise<
		{ success: boolean } | ActionFailure<{ email?: string; name?: string; message: string }>
	> => {
		const body = Object.fromEntries(await request.formData()) as {
			[key: string]: string;
		};

		const email = body.email.toString().toLowerCase();
		const data = {
			email: email,
			name: body.name as string
		};

		// Basic validation
		if (!email || !body.password || !body.passwordConfirm || !body.name)
			return fail(400, {
				...data,
				message:
					"You didn't fill out all the fields. Please try again. (Register - Basic Validation)"
			});
		if (body.password !== body.passwordConfirm)
			return fail(400, {
				...data,
				message: 'Passwords do not match. Please try again. (Register - Passwords Match)'
			});
		if (
			body.password.length < 5 ||
			body.passwordConfirm.length < 5 ||
			body.password.length > 72 ||
			body.passwordConfirm.length > 72
		)
			return fail(400, {
				...data,
				message:
					'Password must be between 5 and 72 characters. Please try again. (Register - Password Length)'
			});
		if (body.name.length < 2 || body.name.length > 150)
			return fail(400, {
				...data,
				message:
					'Name must be between 2 and 150 characters. Please try again. (Register - Name Length)'
			});

		// const { userRecord, creationError } = await createUser(locals.pb, email, body.password, body.name)
		//   .then((res) => ({ userRecord: res, creationError: null }))
		//   .catch((err: HandledPBError) => ({
		//     userRecord: null,
		//     creationError: err.failReturn(data)
		//   }));
		// if (creationError || !userRecord) return creationError;

		// const { authError } = await locals.pb
		//   .collection(Collections.Users)
		//   .authWithPassword(email as string, body.password as string)
		//   .then((res) => ({ tryAuth: res, authError: null }))
		//   .catch((err) => ({
		//     tryAuth: null,
		//     authError: fail(500, { ...data, message: err.message })
		//   }));
		// if (authError) return authError;

		if (url.searchParams.has('redirect'))
			redirect(303, `/${url.searchParams.get('redirect') || ''}`);
		return { success: true };
	}
};
