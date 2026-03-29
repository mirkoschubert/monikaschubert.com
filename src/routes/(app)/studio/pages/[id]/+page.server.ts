import { getPageById, createPage, updatePage } from '$lib/server/services/page'
import { requirePermission } from '$lib/server/services/permission'
import { error, fail, redirect } from '@sveltejs/kit'
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
	const titleEn = data.get('title_en')?.toString().trim() ?? ''
	const titleDe = data.get('title_de')?.toString().trim() ?? ''
	const slug = data.get('slug')?.toString().trim() ?? ''
	const contentEn = data.get('content_en')?.toString() ?? ''
	const contentDe = data.get('content_de')?.toString() ?? ''
	const heroImage = data.get('hero_image')?.toString().trim() || null
	const seoTitleEn = data.get('seo_title_en')?.toString().trim() ?? ''
	const seoTitleDe = data.get('seo_title_de')?.toString().trim() ?? ''
	const seoDescEn = data.get('seo_description_en')?.toString().trim() ?? ''
	const seoDescDe = data.get('seo_description_de')?.toString().trim() ?? ''

	if (!titleEn) return fail(400, { error: 'title_required' })
	if (!slug) return fail(400, { error: 'slug_required' })

	const title: LocalizedString = { en: titleEn, de: titleDe }
	const content: LocalizedString = { en: contentEn, de: contentDe }
	const seoTitle = seoTitleEn || seoTitleDe ? { en: seoTitleEn, de: seoTitleDe } : null
	const seoDescription = seoDescEn || seoDescDe ? { en: seoDescEn, de: seoDescDe } : null

	try {
		if (isNew) {
			const p = await createPage({ title, slug, content, heroImage, seoTitle, seoDescription, status })
			redirect(302, `/studio/pages/${p.id}`)
		} else {
			const id = Number(params.id)
			await updatePage(id, { title, slug, content, heroImage, seoTitle, seoDescription, status })
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
