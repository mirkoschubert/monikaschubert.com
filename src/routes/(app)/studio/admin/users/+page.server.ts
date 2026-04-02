import {
  getAllUsers,
  deleteUser,
  setUserRole,
  createUser,
  updateUser,
  banUser,
  setUserPassword
} from '$lib/server/services/user'
import { requirePermission } from '$lib/server/services/permission'
import { getAllPermissionsForRole } from '$lib/server/services/role'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const role = locals.user?.role ?? 'editor'
  const [users, perms] = await Promise.all([
    getAllUsers(),
    getAllPermissionsForRole(role, 'user')
  ])
  return {
    users,
    canCreate: perms['create'] ?? false,
    canUpdate: perms['update'] ?? false,
    canDelete: perms['delete'] ?? false,
    canSetRole: perms['set-role'] ?? false,
    canBan: perms['ban'] ?? false,
    canSetPassword: perms['set-password'] ?? false
  }
}

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'delete')
    const data = await request.formData()
    const id = data.get('id')?.toString()
    if (!id) return fail(400, { error: 'Missing user id' })
    if (id === locals.user?.id)
      return fail(400, { error: 'Cannot delete yourself' })
    await deleteUser(id)
    return { success: true }
  },

  setRole: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'set-role')
    const data = await request.formData()
    const id = data.get('id')?.toString()
    const role = data.get('role')?.toString()
    if (!id || !role) return fail(400, { error: 'Missing fields' })
    if (id === locals.user?.id)
      return fail(400, { error: 'Cannot change your own role' })
    if (role !== 'admin' && role !== 'editor')
      return fail(400, { error: 'Invalid role' })
    await setUserRole(id, role)
    return { success: true }
  },

  update: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'update')
    const data = await request.formData()
    const id = data.get('id')?.toString()
    const name = data.get('name')?.toString()
    const email = data.get('email')?.toString()
    if (!id) return fail(400, { error: 'Missing user id' })
    await updateUser(id, { name, email })
    return { success: true }
  },

  ban: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'ban')
    const data = await request.formData()
    const id = data.get('id')?.toString()
    const banned = data.get('banned') === 'true'
    if (!id) return fail(400, { error: 'Missing user id' })
    if (id === locals.user?.id)
      return fail(400, { error: 'Cannot ban yourself' })
    await banUser(id, banned)
    return { success: true }
  },

  setPassword: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'set-password')
    const data = await request.formData()
    const id = data.get('id')?.toString()
    const password = data.get('password')?.toString()
    if (!id || !password) return fail(400, { error: 'Missing fields' })
    await setUserPassword(id, password, request.headers)
    return { success: true }
  },

  create: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'create')
    const data = await request.formData()
    const name = data.get('name')?.toString()
    const email = data.get('email')?.toString()
    const password = data.get('password')?.toString()
    const role = data.get('role')?.toString()
    if (!name || !email || !password)
      return fail(400, { error: 'Missing fields' })
    if (role !== 'admin' && role !== 'editor')
      return fail(400, { error: 'Invalid role' })
    await createUser({ name, email, password, role }, request.headers)
    return { success: true }
  }
}
