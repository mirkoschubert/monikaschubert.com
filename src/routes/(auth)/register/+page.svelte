<script lang="ts">
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { Eye, EyeOff, RefreshCw } from '@lucide/svelte';
	import { generatePassword } from '$lib/utils/password';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let showPassword = $state(false);
	let password = $state('');
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
				<div class="flex gap-2">
					<div class="relative flex-1">
						<Input id="password" name="password" type={showPassword ? 'text' : 'password'} bind:value={password} required autocomplete="new-password" class="pr-10" />
						<button type="button" onclick={() => (showPassword = !showPassword)} class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
							{#if showPassword}<EyeOff class="size-4" />{:else}<Eye class="size-4" />{/if}
						</button>
					</div>
					<Button type="button" variant="outline" size="icon" onclick={() => { password = generatePassword(); showPassword = true; }} title={m.password_generate()}>
						<RefreshCw class="size-4" />
					</Button>
				</div>
			</div>
			<Button type="submit" class="w-full">{m.register_submit()}</Button>
		</form>
	</Card.Content>
</Card.Root>
