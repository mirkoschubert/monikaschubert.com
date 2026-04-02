import * as schema from './schema'
import { env } from '$env/dynamic/private'

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

async function createDb() {
  if (process.env.NODE_ENV === 'production') {
    const { drizzle } = await import('drizzle-orm/neon-http')
    const { neon } = await import('@neondatabase/serverless')
    return drizzle(neon(env.DATABASE_URL!), { schema })
  } else {
    const { drizzle } = await import('drizzle-orm/postgres-js')
    const postgres = (await import('postgres')).default
    return drizzle(postgres(env.DATABASE_URL!), { schema })
  }
}

export const db = await createDb()
