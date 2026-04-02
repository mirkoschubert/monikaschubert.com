import {
  getAllSessions,
  revokeSession,
  revokeAllUserSessions
} from '$lib/server/services/session'
import { requirePermission } from '$lib/server/services/permission'
import { getAllPermissionsForRole } from '$lib/server/services/role'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  await requirePermission(locals.user, 'session', 'list')
  const role = locals.user?.role ?? 'editor'
  const [sessions, perms] = await Promise.all([
    getAllSessions(),
    getAllPermissionsForRole(role, 'session')
  ])
  return { sessions, canRevoke: perms['revoke'] ?? false }
}

export const actions: Actions = {
  revoke: async ({ request, locals }) => {
    await requirePermission(locals.user, 'session', 'revoke')
    const data = await request.formData()
    const token = data.get('token')?.toString()
    if (!token) return fail(400, { error: 'Missing token' })
    await revokeSession(token, request.headers)
    return { success: true }
  },

  revokeAll: async ({ request, locals }) => {
    await requirePermission(locals.user, 'session', 'revoke')
    const data = await request.formData()
    const userId = data.get('userId')?.toString()
    if (!userId) return fail(400, { error: 'Missing userId' })
    await revokeAllUserSessions(userId, request.headers)
    return { success: true }
  }
}
