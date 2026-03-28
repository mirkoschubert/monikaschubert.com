import { db } from '$lib/server/db';
import { exhibition } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function getPublishedExhibitions() {
	return db
		.select()
		.from(exhibition)
		.where(eq(exhibition.published, true))
		.orderBy(desc(exhibition.dateFrom));
}

export async function getAllExhibitions() {
	return db.select().from(exhibition).orderBy(desc(exhibition.dateFrom));
}

export async function getExhibitionById(id: number) {
	const [item] = await db.select().from(exhibition).where(eq(exhibition.id, id));
	if (!item) error(404, 'Exhibition not found');
	return item;
}
