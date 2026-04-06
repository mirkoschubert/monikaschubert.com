import {
  getExhibitionById,
  createExhibition,
  updateExhibition
} from '$lib/server/services/exhibition'
import { requirePermission } from '$lib/server/services/permission'
import { error, fail, redirect } from '@sveltejs/kit'
import { exhibitionSchema, parseFormData } from '$lib/validation'
import type { Actions, PageServerLoad } from './$types'
import type { LocalizedString } from '$lib/server/db/schema'

export const load: PageServerLoad = async ({ params, locals }) => {
  if (params.id === 'new') {
    await requirePermission(locals.user, 'exhibition', 'create')
    return { exhibition: null }
  }
  await requirePermission(locals.user, 'exhibition', 'update')
  const id = Number(params.id)
  if (!id) error(404, 'Not found')
  const exhibition = await getExhibitionById(id)
  if (!exhibition) error(404, 'Not found')
  return { exhibition }
}

async function save(
  request: Request,
  locals: App.Locals,
  params: { id: string },
  status: 'draft' | 'published'
) {
  const isNew = params.id === 'new'
  await requirePermission(
    locals.user,
    'exhibition',
    isNew ? 'create' : 'update'
  )

  const data = await request.formData()
  const parsed = parseFormData(exhibitionSchema, data)
  if (!parsed.success) return fail(400, { error: parsed.error })

  const d = parsed.data
  const title: LocalizedString = { en: d.title_en, de: d.title_de }
  const description: LocalizedString = {
    en: d.description_en,
    de: d.description_de
  }
  const location: LocalizedString = {
    en: d.location_en,
    de: d.location_de
  }

  try {
    if (isNew) {
      const item = await createExhibition({
        title,
        description,
        type: d.type,
        location,
        dateFrom: new Date(d.date_from),
        dateTo: d.date_to ? new Date(d.date_to) : null,
        status
      })
      redirect(302, `/studio/exhibitions/${item.id}`)
    } else {
      const id = Number(params.id)
      await updateExhibition(id, {
        title,
        description,
        type: d.type,
        location,
        dateFrom: new Date(d.date_from),
        dateTo: d.date_to ? new Date(d.date_to) : null,
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
      return fail(400, { error: 'duplicate' })
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
