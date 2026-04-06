import { redirect, fail } from '@sveltejs/kit'
import { auth } from '$lib/server/auth'
import { db } from '$lib/server/db'
import { user } from '$lib/server/db/auth.schema'
import { count } from 'drizzle-orm'
import { loginSchema, registerSchema, parseFormData } from '$lib/validation'
import { rateLimit, getClientIp } from '$lib/server/rate-limit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, '/studio/dashboard')
  }

  const [{ value }] = await db.select({ value: count() }).from(user)
  return { isSetup: value === 0 }
}

export const actions: Actions = {
  signIn: async (event) => {
    const ip = getClientIp(event.request)
    const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)
    if (!rl.allowed) {
      return fail(429, {
        error: `Too many attempts. Try again in ${rl.retryAfter}s`
      })
    }

    const data = await event.request.formData()
    const parsed = parseFormData(loginSchema, data)
    if (!parsed.success) return fail(400, { error: parsed.error })

    const result = await auth.api.signInEmail({
      body: parsed.data,
      asResponse: true
    })

    if (!result.ok) {
      return fail(400, { error: 'login_error_invalid' })
    }

    redirect(302, '/studio/dashboard')
  },

  register: async (event) => {
    const ip = getClientIp(event.request)
    const rl = rateLimit(`register:${ip}`, 3, 60 * 60 * 1000)
    if (!rl.allowed) {
      return fail(429, {
        error: `Too many attempts. Try again in ${rl.retryAfter}s`
      })
    }

    const data = await event.request.formData()
    const parsed = parseFormData(registerSchema, data)
    if (!parsed.success) return fail(400, { error: parsed.error })

    const result = await auth.api.signUpEmail({
      body: parsed.data,
      asResponse: true
    })

    if (!result.ok) {
      return fail(400, { error: 'register_error' })
    }

    redirect(302, '/studio/dashboard')
  }
}
