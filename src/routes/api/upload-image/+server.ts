import { put } from '@vercel/blob'
import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import type { RequestHandler } from './$types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
]

export const PUT: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) error(401, 'Unauthorized')

  const contentType = request.headers.get('content-type') ?? ''
  if (!ALLOWED_TYPES.includes(contentType)) {
    error(400, 'Only JPEG, PNG, WebP, GIF, and AVIF uploads are allowed')
  }

  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
    error(400, 'File size must be under 10 MB')
  }

  if (!env.BLOB_READ_WRITE_TOKEN)
    error(500, 'BLOB_READ_WRITE_TOKEN is not configured')

  const filename = request.headers.get('x-filename') ?? `image-${Date.now()}`
  const buffer = await request.arrayBuffer()

  if (buffer.byteLength > MAX_FILE_SIZE) {
    error(400, 'File size must be under 10 MB')
  }

  const blob = await put(`pages/${filename}`, buffer, {
    access: 'public',
    contentType,
    token: env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true
  })

  return json({ url: blob.url })
}
