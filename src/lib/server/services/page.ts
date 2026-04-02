import { db } from '$lib/server/db'
import { page } from '$lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { LocalizedString } from '$lib/server/db/schema'

export type PageInsert = {
  title: LocalizedString
  slug: string
  content?: LocalizedString | null
  heroImage?: string | null
  seoTitle?: LocalizedString | null
  seoDescription?: LocalizedString | null
  status?: 'draft' | 'published'
}

export type PageUpdate = Partial<PageInsert>

export async function getPages() {
  return db.select().from(page).orderBy(desc(page.updatedAt))
}

export async function getPageById(id: number) {
  const [p] = await db.select().from(page).where(eq(page.id, id))
  return p ?? null
}

export async function getPageBySlug(slug: string) {
  const [p] = await db.select().from(page).where(eq(page.slug, slug))
  return p ?? null
}

export async function createPage(data: PageInsert) {
  const [p] = await db
    .insert(page)
    .values({ ...data, updatedAt: new Date() })
    .returning()
  return p
}

export async function updatePage(id: number, data: PageUpdate) {
  await db
    .update(page)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(page.id, id))
}

export async function deletePage(id: number) {
  await db.delete(page).where(eq(page.id, id))
}
