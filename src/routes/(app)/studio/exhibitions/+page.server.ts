import {
  getAllExhibitions,
  deleteExhibition,
  getExhibitionPage,
  updateExhibitionPageImageUrl
} from '$lib/server/services/exhibition'
import { requirePermission } from '$lib/server/services/permission'
import { getAllPermissionsForRole } from '$lib/server/services/role'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  await requirePermission(locals.user, 'exhibition', 'update')
  const roleId = locals.user?.role ?? 'editor'
  const [exhibitions, perms, exhibitionPage] = await Promise.all([
    getAllExhibitions(),
    getAllPermissionsForRole(roleId, 'exhibition'),
    getExhibitionPage()
  ])
  return {
    exhibitions,
    exhibitionPage,
    canCreate: perms['create'] ?? false,
    canDelete: perms['delete'] ?? false
  }
}

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    await requirePermission(locals.user, 'exhibition', 'delete')
    const data = await request.formData()
    const id = Number(data.get('id'))
    if (!id) return fail(400, { error: 'Missing id' })
    await deleteExhibition(id)
    return { success: true }
  },
  updateImage: async ({ request, locals }) => {
    await requirePermission(locals.user, 'exhibition', 'update')
    const data = await request.formData()
    const imageUrl = (data.get('image_url') as string) || null
    await updateExhibitionPageImageUrl(imageUrl)
    return { success: true }
  }
}
