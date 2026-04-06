import { getAllArtworks } from '$lib/server/services/artwork'
import { requirePermission } from '$lib/server/services/permission'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  await requirePermission(locals.user, 'artwork', 'update')
  const artworks = await getAllArtworks()
  return { artworks }
}
