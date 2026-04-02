import { requirePermission } from '$lib/server/services/permission'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
  await requirePermission(locals.user, 'user', 'list')
}
