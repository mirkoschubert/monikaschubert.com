<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import * as m from '$lib/paraglide/messages.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let passkeyError = $state(false);

	async function signInWithPasskey() {
		passkeyError = false;
		const result = await authClient.signIn.passkey();
		if (result?.error) {
			passkeyError = true;
		} else {
			goto('/studio/dashboard');
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{m.login_title()}</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-4">
		{#if form?.error}
			<p class="text-sm text-destructive">{m.login_error_invalid()}</p>
		{/if}

		<form method="POST" action="?/signIn" use:enhance class="flex flex-col gap-4">
			<div class="flex flex-col gap-1.5">
				<Label for="email">{m.login_email()}</Label>
				<Input id="email" name="email" type="email" required autocomplete="email" />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="password">{m.login_password()}</Label>
				<Input id="password" name="password" type="password" required autocomplete="current-password" />
			</div>
			<Button type="submit" class="w-full">{m.login_submit()}</Button>
		</form>

		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t"></span>
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="bg-background px-2 opacity-60">or</span>
			</div>
		</div>

		{#if passkeyError}
			<p class="text-sm text-destructive">{m.login_error_invalid()}</p>
		{/if}
		<Button variant="outline" class="w-full" onclick={signInWithPasskey}>
			{m.login_passkey()}
		</Button>
	</Card.Content>
</Card.Root>
