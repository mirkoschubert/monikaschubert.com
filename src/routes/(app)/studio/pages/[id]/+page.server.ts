import { getPageById, createPage, updatePage } from '$lib/server/services/page'
import { requirePermission } from '$lib/server/services/permission'
import { error, fail, redirect } from '@sveltejs/kit'
import { pageSchema, parseFormData } from '$lib/validation'
import type { Actions, PageServerLoad } from './$types'
import type { LocalizedString } from '$lib/server/db/schema'

export const load: PageServerLoad = async ({ params, locals }) => {
  if (params.id === 'new') {
    await requirePermission(locals.user, 'page', 'create')
    return { page: null }
  }
  await requirePermission(locals.user, 'page', 'update')
  const id = Number(params.id)
  if (!id) error(404, 'Not found')
  const page = await getPageById(id)
  if (!page) error(404, 'Not found')
  return { page }
}

async function save(
  request: Request,
  locals: App.Locals,
  params: { id: string },
  status: 'draft' | 'published'
) {
  const isNew = params.id === 'new'
  await requirePermission(locals.user, 'page', isNew ? 'create' : 'update')

  const data = await request.formData()
  const parsed = parseFormData(pageSchema, data)
  if (!parsed.success) return fail(400, { error: parsed.error })

  const d = parsed.data
  const title: LocalizedString = { en: d.title_en, de: d.title_de }
  const content: LocalizedString = { en: d.content_en, de: d.content_de }
  const heroImage = d.hero_image || null
  const seoTitle =
    d.seo_title_en || d.seo_title_de
      ? { en: d.seo_title_en, de: d.seo_title_de }
      : null
  const seoDescription =
    d.seo_description_en || d.seo_description_de
      ? { en: d.seo_description_en, de: d.seo_description_de }
      : null

  try {
    if (isNew) {
      const p = await createPage({
        title,
        slug: d.slug,
        content,
        heroImage,
        seoTitle,
        seoDescription,
        status
      })
      redirect(302, `/studio/pages/${p.id}`)
    } else {
      const id = Number(params.id)
      await updatePage(id, {
        title,
        slug: d.slug,
        content,
        heroImage,
        seoTitle,
        seoDescription,
        status
      })
      return { success: true }
    }
  } catch (e: unknown) {
    if (
      e &&
      typeof e === 'object' &&
      'code' in e &&
      (e as { code: string }).code === '23505'
    ) {
      return fail(400, { error: 'slug_taken' })
    }
    throw e
  }
}

export const actions: Actions = {
  saveDraft: async ({ request, locals, params }) => {
    return save(request, locals, params, 'draft')
  },
  publish: async ({ request, locals, params }) => {
    return save(request, locals, params, 'published')
  }
}
