import { db } from '$lib/server/db'
import { exhibition, exhibitionPage } from '$lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { LocalizedString } from '$lib/server/db/schema'

export type ExhibitionInsert = {
  title: LocalizedString
  description?: LocalizedString | null
  type: string
  location: LocalizedString
  dateFrom: Date
  dateTo?: Date | null
  status?: 'draft' | 'published'
}

export type ExhibitionUpdate = Partial<ExhibitionInsert>

export async function getPublishedExhibitions() {
  return db
    .select()
    .from(exhibition)
    .where(eq(exhibition.status, 'published'))
    .orderBy(desc(exhibition.dateFrom))
}

export async function getAllExhibitions() {
  return db.select().from(exhibition).orderBy(desc(exhibition.dateFrom))
}

export async function getExhibitionById(id: number) {
  const [item] = await db.select().from(exhibition).where(eq(exhibition.id, id))
  return item ?? null
}

export async function createExhibition(data: ExhibitionInsert) {
  const [item] = await db
    .insert(exhibition)
    .values({ ...data, updatedAt: new Date() })
    .returning()
  return item
}

export async function updateExhibition(id: number, data: ExhibitionUpdate) {
  await db
    .update(exhibition)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(exhibition.id, id))
}

export async function deleteExhibition(id: number) {
  await db.delete(exhibition).where(eq(exhibition.id, id))
}

export async function getExhibitionPage() {
  const [row] = await db.select().from(exhibitionPage).limit(1)
  return row ?? null
}

export async function updateExhibitionPageImageUrl(imageUrl: string | null) {
  const existing = await getExhibitionPage()
  if (existing) {
    await db
      .update(exhibitionPage)
      .set({ imageUrl })
      .where(eq(exhibitionPage.id, existing.id))
  } else {
    await db.insert(exhibitionPage).values({ imageUrl })
  }
}
