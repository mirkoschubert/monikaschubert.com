<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="max-w-2xl">
	<h1 class="text-2xl font-semibold">
		{m.studio_welcome()}, {data.user.name}
	</h1>
	<p class="mt-2 text-muted-foreground">
		{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
	</p>
</div>
