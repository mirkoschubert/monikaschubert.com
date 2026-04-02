import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { sveltekitCookies } from 'better-auth/svelte-kit'
import { passkey } from '@better-auth/passkey'
import { admin } from 'better-auth/plugins/admin'
import { env } from '$env/dynamic/private'
import { getRequestEvent } from '$app/server'
import { db } from '$lib/server/db'
import { user as dbUser } from '$lib/server/db/auth.schema'
import { sql } from 'drizzle-orm'
import { getBaseUrl } from '$lib/url'
import { ac, adminRole, editorRole } from '$lib/server/permissions'

export const auth = betterAuth({
  baseURL: getBaseUrl(),
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // First user ever gets admin role
          const [{ count }] = await db
            .select({ count: sql`count(*)` })
            .from(dbUser)
          return {
            data: { ...user, role: Number(count) === 0 ? 'admin' : 'editor' }
          }
        }
      }
    }
  },
  plugins: [
    passkey(),
    admin({
      defaultRole: 'editor',
      adminRoles: ['admin'],
      ac,
      roles: { admin: adminRole, editor: editorRole }
    }),
    sveltekitCookies(getRequestEvent) // must be last plugin
  ]
})
