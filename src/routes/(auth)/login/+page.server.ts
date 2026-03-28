import { redirect, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/studio/dashboard');
	}
	return {};
};

export const actions: Actions = {
	signIn: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email')?.toString().trim() ?? '';
		const password = data.get('password')?.toString() ?? '';

		const result = await auth.api.signInEmail({
			body: { email, password },
			asResponse: true
		});

		if (!result.ok) {
			return fail(400, { error: 'login_error_invalid' });
		}

		redirect(302, '/studio/dashboard');
	}
};
