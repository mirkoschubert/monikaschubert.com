<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { authClient } from '$lib/auth-client'
	import * as m from '$lib/paraglide/messages.js'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import * as Card from '$lib/components/ui/card'
	import { Eye, EyeOff, RefreshCw } from '@lucide/svelte'
	import { generatePassword } from '$lib/utils/password'
	import type { PageData, ActionData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()

	let showPassword = $state(false)
	let password = $state('')
	let passkeyError = $state(false)

	async function signInWithPasskey() {
		passkeyError = false
		const result = await authClient.signIn.passkey()
		if (result?.error) {
			passkeyError = true
		} else {
			goto('/studio/dashboard')
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4">
	<div class="w-full max-w-sm">
		{#if data.isSetup}
			<!-- First-time setup: register the admin -->
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
									<Input
										id="password"
										name="password"
										type={showPassword ? 'text' : 'password'}
										bind:value={password}
										required
										autocomplete="new-password"
										class="pr-10"
									/>
									<button
										type="button"
										onclick={() => (showPassword = !showPassword)}
										class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									>
										{#if showPassword}<EyeOff class="size-4" />{:else}<Eye class="size-4" />{/if}
									</button>
								</div>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onclick={() => { password = generatePassword(); showPassword = true }}
									title={m.password_generate()}
								>
									<RefreshCw class="size-4" />
								</Button>
							</div>
						</div>
						<Button type="submit" class="w-full">{m.register_submit()}</Button>
					</form>
				</Card.Content>
			</Card.Root>
		{:else}
			<!-- Login -->
			<Card.Root>
				<Card.Header>
					<Card.Title>{m.login_title()}</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					{#if form?.error === 'login_error_invalid'}
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
		{/if}
	</div>
</div>
