import { getPages, deletePage } from '$lib/server/services/page'
import { requirePermission } from '$lib/server/services/permission'
import { hasPermission } from '$lib/server/services/role'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	await requirePermission(locals.user, 'page', 'update')
	const roleId = locals.user?.role ?? 'editor'
	const [pages, canCreate, canDelete] = await Promise.all([
		getPages(),
		hasPermission(roleId, 'page', 'create'),
		hasPermission(roleId, 'page', 'delete'),
	])
	return { pages, canCreate, canDelete }
}

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		await requirePermission(locals.user, 'page', 'delete')
		const data = await request.formData()
		const id = Number(data.get('id'))
		if (!id) return fail(400, { error: 'Missing id' })
		await deletePage(id)
		return { success: true }
	}
}
