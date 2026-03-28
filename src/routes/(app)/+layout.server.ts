import { redirect } from '@sveltejs/kit';
import { seedRoles } from '$lib/server/services/role';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/login');
	}
	await seedRoles();
	return { user: event.locals.user };
};
