import {
  getPublishedExhibitions,
  getExhibitionPage
} from '$lib/server/services/exhibition'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const [exhibitions, exhibitionPage] = await Promise.all([
    getPublishedExhibitions(),
    getExhibitionPage()
  ])
  return { exhibitions, exhibitionPage }
}
