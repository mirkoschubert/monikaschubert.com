<script lang="ts">
	import { enhance } from '$app/forms'
	import * as m from '$lib/paraglide/messages.js'
	import * as Card from '$lib/components/ui/card'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Button } from '$lib/components/ui/button'
	import type { PageData, ActionData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<div class="max-w-2xl space-y-6">
	<h1 class="text-2xl font-semibold">{m.settings_title()}</h1>

	<Card.Root>
		<Card.Header>
			<Card.Title>{m.settings_account()}</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if form?.success}
				<p class="mb-4 text-sm text-green-500">{m.settings_saved()}</p>
			{/if}
			{#if form?.error}
				<p class="mb-4 text-sm text-destructive">{form.error}</p>
			{/if}
			<form method="POST" action="?/update" use:enhance class="space-y-4">
				<div class="space-y-1.5">
					<Label for="name">{m.settings_name()}</Label>
					<Input id="name" name="name" value={data.user?.name} required />
				</div>
				<div class="space-y-1.5">
					<Label for="email">{m.settings_email()}</Label>
					<Input id="email" name="email" type="email" value={data.user?.email} required />
				</div>
				<Button type="submit">{m.settings_save()}</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
