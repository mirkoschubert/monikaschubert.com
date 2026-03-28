<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import type { LayoutData } from '../../$types';

	let { data }: { data: LayoutData } = $props();
</script>

<div class="max-w-2xl space-y-6">
	<h1 class="text-2xl font-semibold">{m.settings_title()}</h1>

	<Card.Root>
		<Card.Header>
			<Card.Title>{m.settings_account()}</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="space-y-1.5">
				<Label for="name">{m.settings_name()}</Label>
				<Input id="name" value={data.user.name} disabled />
			</div>
			<div class="space-y-1.5">
				<Label for="email">{m.settings_email()}</Label>
				<Input id="email" value={data.user.email} disabled />
			</div>
			<p class="text-xs text-muted-foreground">
				Contact your administrator to change account details.
			</p>
		</Card.Content>
	</Card.Root>
</div>
