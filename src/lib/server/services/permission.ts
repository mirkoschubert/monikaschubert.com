import { error, redirect } from '@sveltejs/kit'
import { hasPermission } from '$lib/server/services/role'
import type { UserWithRole } from 'better-auth/plugins/admin'

export async function requirePermission(
	user: UserWithRole | undefined,
	resource: string,
	action: string
) {
	if (!user) redirect(302, '/login')
	const allowed = await hasPermission(user.role ?? 'editor', resource, action)
	if (!allowed) error(403, 'Forbidden')
}
