<script lang="ts">
	import { enhance } from '$app/forms'
	import * as m from '$lib/paraglide/messages.js'
	import * as Table from '$lib/components/ui/table'
	import { Switch } from '$lib/components/ui/switch'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	const resourceLabels: Record<string, string> = {
		artwork:    m.admin_roles_resource_artwork(),
		exhibition: m.admin_roles_resource_exhibition(),
		user:       m.admin_roles_resource_user(),
		session:    m.admin_roles_resource_session(),
	}

	const actionLabels: Record<string, string> = {
		create:         m.admin_roles_action_create(),
		update:         m.admin_roles_action_update(),
		delete:         m.admin_roles_action_delete(),
		publish:        m.admin_roles_action_publish(),
		read:           m.admin_roles_action_read(),
		list:           m.admin_roles_action_list(),
		'set-role':     m.admin_roles_action_set_role(),
		ban:            m.admin_roles_action_ban(),
		'set-password': m.admin_roles_action_set_password(),
		revoke:         m.admin_roles_action_revoke(),
	}

	function isAllowed(roleId: string, resource: string, action: string): boolean {
		const role = data.roles.find((r) => r.id === roleId)
		return role?.permissions.find((p) => p.resource === resource && p.action === action)?.allowed ?? false
	}
</script>

<div class="max-w-4xl space-y-6">
	<h1 class="text-2xl font-semibold">{m.admin_roles_title()}</h1>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-36"></Table.Head>
				<Table.Head class="w-36"></Table.Head>
				{#each data.roles as role}
					<Table.Head class="w-32 text-center">{role.label}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.resources as resource}
				{#each data.actions[resource] as action, i}
					<Table.Row>
						{#if i === 0}
							<Table.Cell
								class="align-middle font-medium"
								rowspan={data.actions[resource].length}
							>
								{resourceLabels[resource] ?? resource}
							</Table.Cell>
						{/if}
						<Table.Cell class="text-muted-foreground text-sm">
							{actionLabels[action] ?? action}
						</Table.Cell>
						{#each data.roles as role}
							<Table.Cell class="text-center">
								{#if data.canEdit}
									<form method="POST" action="?/setPermission" use:enhance>
										<input type="hidden" name="roleId" value={role.id} />
										<input type="hidden" name="resource" value={resource} />
										<input type="hidden" name="action" value={action} />
										<input type="hidden" name="allowed" value={(!isAllowed(role.id, resource, action)).toString()} />
										<Switch
											checked={isAllowed(role.id, resource, action)}
											onCheckedChange={() => {
												(document.activeElement as HTMLElement)?.closest('form')?.requestSubmit()
											}}
										/>
									</form>
								{:else}
									<Switch checked={isAllowed(role.id, resource, action)} disabled />
								{/if}
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			{/each}
		</Table.Body>
	</Table.Root>
</div>
