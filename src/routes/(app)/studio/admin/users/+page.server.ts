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
import {
  createUserSchema,
  updateUserSchema,
  setUserRoleSchema,
  setPasswordSchema,
  banUserSchema,
  deleteUserSchema,
  parseFormData
} from '$lib/validation'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  await requirePermission(locals.user, 'user', 'list')
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
    const parsed = parseFormData(deleteUserSchema, data)
    if (!parsed.success) return fail(400, { error: parsed.error })
    if (parsed.data.id === locals.user?.id)
      return fail(400, { error: 'Cannot delete yourself' })
    await deleteUser(parsed.data.id)
    return { success: true }
  },

  setRole: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'set-role')
    const data = await request.formData()
    const parsed = parseFormData(setUserRoleSchema, data)
    if (!parsed.success) return fail(400, { error: parsed.error })
    if (parsed.data.id === locals.user?.id)
      return fail(400, { error: 'Cannot change your own role' })
    await setUserRole(parsed.data.id, parsed.data.role)
    return { success: true }
  },

  update: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'update')
    const data = await request.formData()
    const parsed = parseFormData(updateUserSchema, data)
    if (!parsed.success) return fail(400, { error: parsed.error })
    await updateUser(parsed.data.id, {
      name: parsed.data.name,
      email: parsed.data.email
    })
    return { success: true }
  },

  ban: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'ban')
    const data = await request.formData()
    const parsed = parseFormData(banUserSchema, data)
    if (!parsed.success) return fail(400, { error: parsed.error })
    if (parsed.data.id === locals.user?.id)
      return fail(400, { error: 'Cannot ban yourself' })
    await banUser(parsed.data.id, parsed.data.banned === 'true')
    return { success: true }
  },

  setPassword: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'set-password')
    const data = await request.formData()
    const parsed = parseFormData(setPasswordSchema, data)
    if (!parsed.success) return fail(400, { error: parsed.error })
    await setUserPassword(parsed.data.id, parsed.data.password, request.headers)
    return { success: true }
  },

  create: async ({ request, locals }) => {
    await requirePermission(locals.user, 'user', 'create')
    const data = await request.formData()
    const parsed = parseFormData(createUserSchema, data)
    if (!parsed.success) return fail(400, { error: parsed.error })
    await createUser(parsed.data, request.headers)
    return { success: true }
  }
}
