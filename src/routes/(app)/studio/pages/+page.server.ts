import { getPages, deletePage } from '$lib/server/services/page'
import { requirePermission } from '$lib/server/services/permission'
import { getAllPermissionsForRole } from '$lib/server/services/role'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  await requirePermission(locals.user, 'page', 'update')
  const roleId = locals.user?.role ?? 'editor'
  const [pages, perms] = await Promise.all([
    getPages(),
    getAllPermissionsForRole(roleId, 'page')
  ])
  return {
    pages,
    canCreate: perms['create'] ?? false,
    canDelete: perms['delete'] ?? false
  }
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
