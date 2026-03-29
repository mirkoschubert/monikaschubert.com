import { getPublishedArtworks } from '$lib/server/services/artwork';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const category = url.searchParams.get('category') ?? undefined;
	const artworks = await getPublishedArtworks(category === 'all' ? undefined : category);
	return { artworks };
};
