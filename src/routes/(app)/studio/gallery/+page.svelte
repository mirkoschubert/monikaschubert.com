<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { localize } from '$lib/types';
	import { getLocaleForUrl } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { Badge } from '$lib/components/ui/badge';
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = $derived(getLocaleForUrl(page.url.href));
</script>

<div class="max-w-4xl">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-semibold">{m.studio_gallery()}</h1>
	</div>

	{#if data.artworks.length === 0}
		<p class="opacity-60">No artworks yet.</p>
	{:else}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>{m.artwork_title()}</Table.Head>
					<Table.Head>{m.artwork_year()}</Table.Head>
					<Table.Head>{m.artwork_medium()}</Table.Head>
					<Table.Head>{m.artwork_published()}</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.artworks as work}
					<Table.Row>
						<Table.Cell class="font-medium">{localize(work.title, locale)}</Table.Cell>
						<Table.Cell>{work.year ?? '-'}</Table.Cell>
						<Table.Cell>{work.medium ?? '-'}</Table.Cell>
						<Table.Cell>
							{#if work.published}
								<Badge>{m.artwork_published()}</Badge>
							{:else}
								<Badge variant="outline">Draft</Badge>
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
