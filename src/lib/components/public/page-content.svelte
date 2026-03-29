<script lang="ts">
	import { marked } from 'marked';
	import { getLocale } from '$lib/paraglide/runtime';
	import { localize } from '$lib/types';
	import type { LocalizedString } from '$lib/server/db/schema';

	let { title, content }: { title: string; content: LocalizedString | null } = $props();

	const locale = getLocale();
	const html = $derived(content ? (marked(localize(content, locale)) as string) : '');
</script>

<div class="mx-auto max-w-3xl px-4 py-12">
	<h1 class="mb-6 text-2xl font-semibold">{title}</h1>
	{#if html}
		<div class="prose prose-sm dark:prose-invert">{@html html}</div>
	{/if}
</div>
