import { getPublishedArtworks } from '$lib/server/services/artwork';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const artworks = await getPublishedArtworks();
	return { artworks };
};
