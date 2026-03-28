<script lang="ts">
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{m.register_title()}</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if form?.error}
			<p class="mb-4 text-sm text-destructive">{m.register_error()}</p>
		{/if}

		<form method="POST" action="?/register" use:enhance class="flex flex-col gap-4">
			<div class="flex flex-col gap-1.5">
				<Label for="name">{m.register_name()}</Label>
				<Input id="name" name="name" type="text" required autocomplete="name" />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="email">{m.register_email()}</Label>
				<Input id="email" name="email" type="email" required autocomplete="email" />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="password">{m.register_password()}</Label>
				<Input id="password" name="password" type="password" required autocomplete="new-password" />
			</div>
			<Button type="submit" class="w-full">{m.register_submit()}</Button>
		</form>
	</Card.Content>
</Card.Root>
