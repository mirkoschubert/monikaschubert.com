import { sequence } from '@sveltejs/kit/hooks'
import { building } from '$app/environment'
import { auth } from '$lib/server/auth'
import { svelteKitHandler } from 'better-auth/svelte-kit'
import type { Handle } from '@sveltejs/kit'
import type { UserWithRole } from 'better-auth/plugins/admin'
import { getTextDirection } from '$lib/paraglide/runtime'
import { paraglideMiddleware } from '$lib/paraglide/server'

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request

    return resolve(event, {
      transformPageChunk: ({ html }) =>
        html
          .replace('%paraglide.lang%', locale)
          .replace('%paraglide.dir%', getTextDirection(locale))
    })
  })

const handleBetterAuth: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({ headers: event.request.headers })

  if (session) {
    event.locals.session = session.session
    event.locals.user = session.user as UserWithRole
  }

  return svelteKitHandler({ event, resolve, auth, building })
}

const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '0')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://*.blob.vercel-storage.com",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  )

  return response
}

export const handle: Handle = sequence(
  handleParaglide,
  handleBetterAuth,
  handleSecurityHeaders
)
