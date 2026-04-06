import { getPageBySlug } from '$lib/server/services/page'

export function loadPublishedPage(slug: string) {
  return async () => {
    const p = await getPageBySlug(slug)
    return { page: p?.status === 'published' ? p : null }
  }
}
