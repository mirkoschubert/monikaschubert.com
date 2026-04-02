import { db } from '$lib/server/db'
import { user } from '$lib/server/db/auth.schema'
import { asc, eq } from 'drizzle-orm'
import { error } from '@sveltejs/kit'
import { auth } from '$lib/server/auth'

export async function getAllUsers() {
  return db.select().from(user).orderBy(asc(user.createdAt))
}

export async function getUserById(id: string) {
  const [found] = await db.select().from(user).where(eq(user.id, id))
  if (!found) error(404, 'User not found')
  return found
}

export async function deleteUser(id: string) {
  await db.delete(user).where(eq(user.id, id))
}

export async function setUserRole(id: string, role: 'admin' | 'editor') {
  await db.update(user).set({ role }).where(eq(user.id, id))
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string }
) {
  await db.update(user).set(data).where(eq(user.id, id))
}

export async function banUser(id: string, banned: boolean) {
  await db.update(user).set({ banned }).where(eq(user.id, id))
}

export async function setUserPassword(
  id: string,
  password: string,
  headers: Headers
) {
  await auth.api.setUserPassword({
    body: { userId: id, newPassword: password },
    headers
  })
}

export async function createUser(
  data: {
    name: string
    email: string
    password: string
    role: 'admin' | 'editor'
  },
  headers: Headers
) {
  await auth.api.createUser({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role
    },
    headers
  })
}
