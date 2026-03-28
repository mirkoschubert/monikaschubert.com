<script lang="ts">
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import * as m from '$lib/paraglide/messages.js'
	import * as Table from '$lib/components/ui/table'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Badge } from '$lib/components/ui/badge'
	import { Trash2, UserPlus, Eye, EyeOff, EllipsisVertical, RefreshCw } from '@lucide/svelte'
	import { generatePassword } from '$lib/utils/password'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let deleteTarget = $state<{ id: string; name: string } | null>(null)
	let editTarget = $state<{ id: string; name: string; email: string } | null>(null)
	let banTarget = $state<{ id: string; name: string; banned: boolean } | null>(null)
	let passwordTarget = $state<{ id: string; name: string } | null>(null)
	let createOpen = $state(false)
	let showPassword = $state(false)
	let newPassword = $state('')
	let showNewPassword = $state(false)
	let setPassword = $state('')

	const hasActions = (userId: string) =>
		userId !== data.user?.id && (data.canUpdate || data.canDelete || data.canBan || data.canSetPassword)
</script>

<div class="max-w-4xl space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">{m.admin_users_title()}</h1>
		{#if data.canCreate}
			<Button onclick={() => (createOpen = true)} size="sm">
				<UserPlus class="size-4" />
				{m.admin_users_create()}
			</Button>
		{/if}
	</div>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>{m.admin_users_name()}</Table.Head>
				<Table.Head>{m.admin_users_email()}</Table.Head>
				<Table.Head>{m.admin_users_role()}</Table.Head>
				<Table.Head>{m.admin_users_status()}</Table.Head>
				<Table.Head>{m.admin_users_created()}</Table.Head>
				<Table.Head class="w-12"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.users as u}
				<Table.Row class={u.banned ? 'opacity-60' : ''}>
					<Table.Cell class="font-medium">{u.name}</Table.Cell>
					<Table.Cell>{u.email}</Table.Cell>
					<Table.Cell>
						{#if data.canSetRole && u.id !== data.user?.id}
							<form method="POST" action="?/setRole" use:enhance>
								<input type="hidden" name="id" value={u.id} />
								<select
									name="role"
									onchange={(e) => (e.currentTarget.form as HTMLFormElement).requestSubmit()}
									class="rounded-md border border-input bg-background px-2 py-1 text-sm"
								>
									<option value="admin" selected={u.role === 'admin'}>{m.admin_users_role_admin()}</option>
									<option value="editor" selected={u.role === 'editor'}>{m.admin_users_role_editor()}</option>
								</select>
							</form>
						{:else}
							<span class="text-sm text-muted-foreground">
								{u.role === 'admin' ? m.admin_users_role_admin() : m.admin_users_role_editor()}
							</span>
						{/if}
					</Table.Cell>
					<Table.Cell>
						{#if u.banned}
							<Badge variant="destructive">{m.admin_users_banned()}</Badge>
						{/if}
					</Table.Cell>
					<Table.Cell class="text-muted-foreground text-sm">
						{new Date(u.createdAt).toLocaleDateString()}
					</Table.Cell>
					<Table.Cell>
						{#if hasActions(u.id)}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Button variant="ghost" size="icon" class="size-8 text-muted-foreground" {...props}>
											<EllipsisVertical class="size-4" />
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									{#if data.canUpdate}
										<DropdownMenu.Item onSelect={() => (editTarget = { id: u.id, name: u.name, email: u.email })}>
											{m.admin_users_edit()}
										</DropdownMenu.Item>
									{/if}
									{#if data.canSetPassword}
										<DropdownMenu.Item onSelect={() => (passwordTarget = { id: u.id, name: u.name })}>
											{m.admin_users_set_password()}
										</DropdownMenu.Item>
									{/if}
									{#if data.canBan}
										<DropdownMenu.Item onSelect={() => (banTarget = { id: u.id, name: u.name, banned: !!u.banned })}>
											{u.banned ? m.admin_users_unban() : m.admin_users_ban()}
										</DropdownMenu.Item>
									{/if}
									{#if data.canDelete}
										<DropdownMenu.Separator />
										<DropdownMenu.Item
											variant="destructive"
											onSelect={() => (deleteTarget = { id: u.id, name: u.name })}
										>
											{m.common_delete()}
										</DropdownMenu.Item>
									{/if}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<!-- Create user dialog -->
<Dialog.Root bind:open={createOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.admin_users_create_title()}</Dialog.Title>
		</Dialog.Header>
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						createOpen = false
						await invalidateAll()
					} else {
						await update()
					}
				}
			}}
			class="space-y-4"
		>
			<div class="space-y-1.5">
				<Label for="name">{m.admin_users_name()}</Label>
				<Input id="name" name="name" required />
			</div>
			<div class="space-y-1.5">
				<Label for="email">{m.admin_users_email()}</Label>
				<Input id="email" name="email" type="email" required />
			</div>
			<div class="space-y-1.5">
				<Label for="password">{m.register_password()}</Label>
				<div class="flex gap-2">
					<div class="relative flex-1">
						<Input id="password" name="password" type={showPassword ? 'text' : 'password'} bind:value={newPassword} required minlength={8} class="pr-10" />
						<button type="button" onclick={() => (showPassword = !showPassword)} class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
							{#if showPassword}<EyeOff class="size-4" />{:else}<Eye class="size-4" />{/if}
						</button>
					</div>
					<Button type="button" variant="outline" size="icon" onclick={() => { newPassword = generatePassword(); showPassword = true; }} title={m.password_generate()}>
						<RefreshCw class="size-4" />
					</Button>
				</div>
			</div>
			<div class="space-y-1.5">
				<Label for="create-role">{m.admin_users_role()}</Label>
				<select id="create-role" name="role" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
					<option value="editor">{m.admin_users_role_editor()}</option>
					<option value="admin">{m.admin_users_role_admin()}</option>
				</select>
			</div>
			<Dialog.Footer>
				<Button variant="outline" type="button" onclick={() => (createOpen = false)}>{m.common_cancel()}</Button>
				<Button type="submit">{m.admin_users_create()}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Edit user dialog -->
<Dialog.Root open={!!editTarget} onOpenChange={(o) => { if (!o) editTarget = null }}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.admin_users_edit_title()}</Dialog.Title>
		</Dialog.Header>
		{#if editTarget}
			<form
				method="POST"
				action="?/update"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							editTarget = null
							await invalidateAll()
						} else {
							await update()
						}
					}
				}}
				class="space-y-4"
			>
				<input type="hidden" name="id" value={editTarget.id} />
				<div class="space-y-1.5">
					<Label for="edit-name">{m.admin_users_name()}</Label>
					<Input id="edit-name" name="name" value={editTarget.name} required />
				</div>
				<div class="space-y-1.5">
					<Label for="edit-email">{m.admin_users_email()}</Label>
					<Input id="edit-email" name="email" type="email" value={editTarget.email} required />
				</div>
				<Dialog.Footer>
					<Button variant="outline" type="button" onclick={() => (editTarget = null)}>{m.common_cancel()}</Button>
					<Button type="submit">{m.common_save()}</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>

<!-- Set password dialog -->
<Dialog.Root open={!!passwordTarget} onOpenChange={(o) => { if (!o) passwordTarget = null }}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.admin_users_set_password_title()}</Dialog.Title>
			{#if passwordTarget}
				<Dialog.Description>{passwordTarget.name}</Dialog.Description>
			{/if}
		</Dialog.Header>
		{#if passwordTarget}
			<form
				method="POST"
				action="?/setPassword"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							passwordTarget = null
						} else {
							await update()
						}
					}
				}}
				class="space-y-4"
			>
				<input type="hidden" name="id" value={passwordTarget.id} />
				<div class="space-y-1.5">
					<Label for="new-password">{m.admin_users_set_password()}</Label>
					<div class="flex gap-2">
						<div class="relative flex-1">
							<Input id="new-password" name="password" type={showNewPassword ? 'text' : 'password'} bind:value={setPassword} required minlength={8} class="pr-10" />
							<button type="button" onclick={() => (showNewPassword = !showNewPassword)} class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
								{#if showNewPassword}<EyeOff class="size-4" />{:else}<Eye class="size-4" />{/if}
							</button>
						</div>
						<Button type="button" variant="outline" size="icon" onclick={() => { setPassword = generatePassword(); showNewPassword = true; }} title={m.password_generate()}>
							<RefreshCw class="size-4" />
						</Button>
					</div>
				</div>
				<Dialog.Footer>
					<Button variant="outline" type="button" onclick={() => (passwordTarget = null)}>{m.common_cancel()}</Button>
					<Button type="submit">{m.common_save()}</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>

<!-- Ban confirm dialog -->
<Dialog.Root open={!!banTarget} onOpenChange={(o) => { if (!o) banTarget = null }}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{banTarget?.banned ? m.admin_users_unban() : m.admin_users_ban()}</Dialog.Title>
			{#if banTarget && !banTarget.banned}
				<Dialog.Description>
					{m.admin_users_ban_confirm()}
				</Dialog.Description>
			{/if}
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (banTarget = null)}>{m.common_cancel()}</Button>
			{#if banTarget}
				<form
					method="POST"
					action="?/ban"
					use:enhance={() => {
						return async ({ update }) => {
							banTarget = null
							await update()
						}
					}}
				>
					<input type="hidden" name="id" value={banTarget.id} />
					<input type="hidden" name="banned" value={(!banTarget.banned).toString()} />
					<Button type="submit" variant={banTarget.banned ? 'default' : 'destructive'}>
						{banTarget.banned ? m.admin_users_unban() : m.admin_users_ban()}
					</Button>
				</form>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete confirm dialog -->
<Dialog.Root open={!!deleteTarget} onOpenChange={(o) => { if (!o) deleteTarget = null }}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.admin_users_delete()}</Dialog.Title>
			<Dialog.Description>
				{m.admin_users_delete_confirm()}
				{#if deleteTarget}<span class="font-medium"> "{deleteTarget.name}"</span>{/if}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deleteTarget = null)}>{m.common_cancel()}</Button>
			{#if deleteTarget}
				<form method="POST" action="?/delete" use:enhance={() => { deleteTarget = null }}>
					<input type="hidden" name="id" value={deleteTarget.id} />
					<Button type="submit" variant="destructive">{m.common_delete()}</Button>
				</form>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
