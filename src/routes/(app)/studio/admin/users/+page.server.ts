import { getAllUsers } from '$lib/server/services/user';
import { deleteUser } from '$lib/server/services/user';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await getAllUsers();
	return { users };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { error: 'Missing user id' });
		// Prevent self-deletion
		if (id === locals.user?.id) return fail(400, { error: 'Cannot delete yourself' });
		await deleteUser(id);
		return { success: true };
	}
};
