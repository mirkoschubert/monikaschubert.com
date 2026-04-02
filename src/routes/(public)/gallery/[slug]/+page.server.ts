import { getArtworkBySlug } from '$lib/server/services/artwork'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const artwork = await getArtworkBySlug(params.slug)
  return { artwork }
}
