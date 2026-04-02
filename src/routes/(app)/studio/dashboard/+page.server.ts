import { redirect } from '@sveltejs/kit'
import { auth } from '$lib/server/auth'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
  return { user: event.locals.user! }
}

export const actions: Actions = {
  signOut: async (event) => {
    await auth.api.signOut({ headers: event.request.headers })
    redirect(302, '/studio')
  }
}
