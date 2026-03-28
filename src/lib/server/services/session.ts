import { db } from '$lib/server/db'
import { session, user } from '$lib/server/db/auth.schema'
import { eq, gt } from 'drizzle-orm'
import { auth } from '$lib/server/auth'

export async function getAllSessions() {
	const now = new Date()
	return db
		.select({
			id: session.id,
			token: session.token,
			userId: session.userId,
			userName: user.name,
			userEmail: user.email,
			ipAddress: session.ipAddress,
			userAgent: session.userAgent,
			createdAt: session.createdAt,
			expiresAt: session.expiresAt,
		})
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(gt(session.expiresAt, now))
		.orderBy(session.createdAt)
}

export async function revokeSession(token: string, headers: Headers) {
	await auth.api.revokeUserSession({
		body: { sessionToken: token },
		headers
	})
}

export async function revokeAllUserSessions(userId: string, headers: Headers) {
	await auth.api.revokeUserSessions({
		body: { userId },
		headers
	})
}
