import { getRolesWithPermissions, setPermission, RESOURCES, ACTIONS } from '$lib/server/services/role'
import { requirePermission } from '$lib/server/services/permission'
import { hasPermission } from '$lib/server/services/role'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const role = locals.user?.role ?? 'editor'
	const [roles, canEdit] = await Promise.all([
		getRolesWithPermissions(),
		hasPermission(role, 'user', 'set-role'),
	])
	return { roles, resources: RESOURCES, actions: ACTIONS, canEdit }
}

export const actions: Actions = {
	setPermission: async ({ request, locals }) => {
		await requirePermission(locals.user, 'user', 'set-role')
		const data = await request.formData()
		const roleId = data.get('roleId')?.toString()
		const resource = data.get('resource')?.toString()
		const action = data.get('action')?.toString()
		const allowed = data.get('allowed') === 'true'
		if (!roleId || !resource || !action) return fail(400, { error: 'Missing fields' })
		await setPermission(roleId, resource, action, allowed)
		return { success: true }
	}
}
