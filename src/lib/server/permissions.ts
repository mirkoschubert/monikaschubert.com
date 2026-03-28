import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements } from 'better-auth/plugins/admin/access'

// Used only to satisfy the Better Auth admin plugin type requirements.
// Actual permission checks are DB-driven via src/lib/server/services/role.ts
export const ac = createAccessControl({
	...defaultStatements,
	artwork: ['create', 'update', 'delete', 'publish'] as const,
	exhibition: ['create', 'update', 'delete', 'publish'] as const,
	settings: ['read', 'update'] as const,
})

export const adminRole = ac.newRole({
	user: ['create', 'list', 'set-role', 'ban', 'delete', 'set-password', 'get', 'update'],
	session: ['list', 'revoke', 'delete'],
	artwork: ['create', 'update', 'delete', 'publish'],
	exhibition: ['create', 'update', 'delete', 'publish'],
	settings: ['read', 'update'],
})

export const editorRole = ac.newRole({
	artwork: ['create', 'update', 'delete', 'publish'],
	exhibition: ['create', 'update', 'delete', 'publish'],
})
