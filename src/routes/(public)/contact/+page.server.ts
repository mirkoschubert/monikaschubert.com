import { getPageBySlug } from '$lib/server/services/page'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const p = await getPageBySlug('contact')
  return { page: p?.status === 'published' ? p : null }
}
