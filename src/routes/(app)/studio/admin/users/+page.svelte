<script lang="ts">
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages.js';
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Trash2 } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let deleteTarget = $state<{ id: string; name: string } | null>(null);
</script>

<div class="max-w-4xl space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">{m.admin_users_title()}</h1>
	</div>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>{m.admin_users_name()}</Table.Head>
				<Table.Head>{m.admin_users_email()}</Table.Head>
				<Table.Head>{m.admin_users_created()}</Table.Head>
				<Table.Head class="w-16">{m.common_actions()}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.users as u}
				<Table.Row>
					<Table.Cell class="font-medium">{u.name}</Table.Cell>
					<Table.Cell>{u.email}</Table.Cell>
					<Table.Cell class="text-muted-foreground text-sm">
						{new Date(u.createdAt).toLocaleDateString()}
					</Table.Cell>
					<Table.Cell>
						<Button
							variant="ghost"
							size="icon"
							class="size-8 text-muted-foreground hover:text-destructive"
							onclick={() => (deleteTarget = { id: u.id, name: u.name })}
						>
							<Trash2 class="size-4" />
						</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<!-- Delete confirm dialog -->
<Dialog.Root open={!!deleteTarget} onOpenChange={(o) => { if (!o) deleteTarget = null; }}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.admin_users_delete()}</Dialog.Title>
			<Dialog.Description>
				{m.admin_users_delete_confirm()}
				{#if deleteTarget}
					<span class="font-medium"> "{deleteTarget.name}"</span>
				{/if}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deleteTarget = null)}>{m.common_cancel()}</Button>
			{#if deleteTarget}
				<form method="POST" action="?/delete" use:enhance={() => { deleteTarget = null; }}>
					<input type="hidden" name="id" value={deleteTarget.id} />
					<Button type="submit" variant="destructive">{m.common_delete()}</Button>
				</form>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
