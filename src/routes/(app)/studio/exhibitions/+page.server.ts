import { getAllExhibitions } from '$lib/server/services/exhibition'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const exhibitions = await getAllExhibitions()
  return { exhibitions }
}
