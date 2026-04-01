import { put } from '@vercel/blob'
import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized')

	const contentType = request.headers.get('content-type') ?? ''
	if (!contentType.startsWith('image/')) error(400, 'Only image uploads are allowed')

	if (!env.BLOB_READ_WRITE_TOKEN) error(500, 'BLOB_READ_WRITE_TOKEN is not configured')

	const filename = request.headers.get('x-filename') ?? `image-${Date.now()}`
	const buffer = await request.arrayBuffer()

	const blob = await put(`pages/${filename}`, buffer, {
		access: 'public',
		contentType,
		token: env.BLOB_READ_WRITE_TOKEN,
		allowOverwrite: true,
	})

	return json({ url: blob.url })
}
