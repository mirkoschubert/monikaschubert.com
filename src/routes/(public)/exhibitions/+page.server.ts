import { getPublishedExhibitions } from '$lib/server/services/exhibition';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { exhibitions: await getPublishedExhibitions() };
};
