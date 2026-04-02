import { redirect, fail } from '@sveltejs/kit'
import { auth } from '$lib/server/auth'
import { db } from '$lib/server/db'
import { user } from '$lib/server/db/auth.schema'
import { count } from 'drizzle-orm'
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
    const data = await event.request.formData()
    const email = data.get('email')?.toString().trim() ?? ''
    const password = data.get('password')?.toString() ?? ''

    const result = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true
    })

    if (!result.ok) {
      return fail(400, { error: 'login_error_invalid' })
    }

    redirect(302, '/studio/dashboard')
  },

  register: async (event) => {
    const data = await event.request.formData()
    const name = data.get('name')?.toString().trim() ?? ''
    const email = data.get('email')?.toString().trim() ?? ''
    const password = data.get('password')?.toString() ?? ''

    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      asResponse: true
    })

    if (!result.ok) {
      return fail(400, { error: 'register_error' })
    }

    redirect(302, '/studio/dashboard')
  }
}
