import { db } from '$lib/server/db'
import { role, rolePermission } from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm'

export const RESOURCES = ['artwork', 'exhibition', 'user', 'session'] as const
export const ACTIONS: Record<typeof RESOURCES[number], string[]> = {
	artwork:    ['create', 'update', 'delete', 'publish'],
	exhibition: ['create', 'update', 'delete', 'publish'],
	user:       ['list', 'create', 'update', 'delete', 'set-role', 'ban', 'set-password'],
	session:    ['list', 'revoke'],
}

export type Resource = typeof RESOURCES[number]

export async function getRolesWithPermissions() {
	const roles = await db.select().from(role)
	const permissions = await db.select().from(rolePermission)
	return roles.map((r) => ({
		...r,
		permissions: permissions.filter((p) => p.roleId === r.id)
	}))
}

export async function hasPermission(roleId: string, resource: string, action: string): Promise<boolean> {
	const [perm] = await db
		.select()
		.from(rolePermission)
		.where(
			and(
				eq(rolePermission.roleId, roleId),
				eq(rolePermission.resource, resource),
				eq(rolePermission.action, action)
			)
		)
	return perm?.allowed ?? false
}

export async function setPermission(roleId: string, resource: string, action: string, allowed: boolean) {
	const [existing] = await db
		.select()
		.from(rolePermission)
		.where(
			and(
				eq(rolePermission.roleId, roleId),
				eq(rolePermission.resource, resource),
				eq(rolePermission.action, action)
			)
		)
	if (existing) {
		await db
			.update(rolePermission)
			.set({ allowed })
			.where(eq(rolePermission.id, existing.id))
	} else {
		await db.insert(rolePermission).values({ roleId, resource, action, allowed })
	}
}

// Seed default roles and permissions if not yet present
export async function seedRoles() {
	const existing = await db.select().from(role)
	if (existing.length > 0) return

	await db.insert(role).values([
		{ id: 'admin', label: 'Admin' },
		{ id: 'editor', label: 'Editor' },
	])

	const adminPermissions: { roleId: string; resource: string; action: string; allowed: boolean }[] = []
	const editorPermissions: { roleId: string; resource: string; action: string; allowed: boolean }[] = []

	for (const [resource, actions] of Object.entries(ACTIONS)) {
		for (const action of actions) {
			adminPermissions.push({ roleId: 'admin', resource, action, allowed: true })
			// editors can only manage content
			const editorAllowed = resource === 'artwork' || resource === 'exhibition'
			editorPermissions.push({ roleId: 'editor', resource, action, allowed: editorAllowed })
		}
	}

	await db.insert(rolePermission).values([...adminPermissions, ...editorPermissions])
}
