import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function getAllUsers() {
	return db.select().from(user).orderBy(user.createdAt);
}

export async function getUserById(id: string) {
	const [found] = await db.select().from(user).where(eq(user.id, id));
	if (!found) error(404, 'User not found');
	return found;
}

export async function deleteUser(id: string) {
	await db.delete(user).where(eq(user.id, id));
}
