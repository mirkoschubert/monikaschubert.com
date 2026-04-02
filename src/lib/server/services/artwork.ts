import { db } from '$lib/server/db'
import { artwork } from '$lib/server/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { error } from '@sveltejs/kit'

export async function getPublishedArtworks(category?: string) {
  const conditions = [eq(artwork.published, true)]
  if (category) conditions.push(eq(artwork.category, category))
  return db
    .select()
    .from(artwork)
    .where(and(...conditions))
    .orderBy(asc(artwork.sortOrder))
}

export async function getArtworkBySlug(slug: string) {
  const [work] = await db
    .select()
    .from(artwork)
    .where(and(eq(artwork.slug, slug), eq(artwork.published, true)))
  if (!work) error(404, 'Artwork not found')
  return work
}

export async function getAllArtworks() {
  return db.select().from(artwork).orderBy(asc(artwork.sortOrder))
}

export async function getArtworkById(id: number) {
  const [work] = await db.select().from(artwork).where(eq(artwork.id, id))
  if (!work) error(404, 'Artwork not found')
  return work
}
