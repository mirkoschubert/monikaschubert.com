import { fail } from '@sveltejs/kit'
import { auth } from '$lib/server/auth'
import { db } from '$lib/server/db'
import { user as userTable } from '$lib/server/db/auth.schema'
import { eq } from 'drizzle-orm'
import { settingsUpdateSchema, parseFormData } from '$lib/validation'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  return { user: locals.user }
}

export const actions: Actions = {
  update: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Unauthorized' })
    const data = await request.formData()
    const parsed = parseFormData(settingsUpdateSchema, data)
    if (!parsed.success) return fail(400, { error: parsed.error })

    const { name, email } = parsed.data
    await auth.api.updateUser({
      body: { name },
      headers: request.headers
    })
    if (email !== locals.user.email) {
      await db
        .update(userTable)
        .set({ email })
        .where(eq(userTable.id, locals.user.id))
    }
    return { success: true }
  }
}
