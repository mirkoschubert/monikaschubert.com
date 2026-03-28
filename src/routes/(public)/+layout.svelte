<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref, deLocalizeUrl, getLocaleForUrl } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<svelte:head>
	{#each locales as locale}
		<link rel="alternate" hreflang={locale} href={localizeHref(deLocalizeUrl(page.url).pathname, { locale })} />
	{/each}
</svelte:head>

<header class="border-b">
	<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
		<a href={localizeHref('/')} class="text-lg font-semibold tracking-wide">Monika Schubert</a>
		<nav class="flex items-center gap-6 text-sm">
			<a href={localizeHref('/about')}>{m.nav_about()}</a>
			<a href={localizeHref('/contact')}>{m.nav_contact()}</a>
			{#if data.user}
				<a href="/studio/dashboard" class="opacity-60">Studio</a>
			{/if}
		</nav>
		<div class="flex gap-2 text-xs">
			{#each locales as locale}
				{@const active = getLocaleForUrl(page.url.href) === locale}
				<a
					href={localizeHref(deLocalizeUrl(page.url).pathname, { locale })}
					class="uppercase {active ? 'font-semibold' : 'opacity-60 hover:opacity-100'}"
				>{locale}</a>
			{/each}
		</div>
	</div>
</header>

<main>
	{@render children()}
</main>

<footer class="border-t mt-16">
	<div class="mx-auto max-w-5xl px-4 py-8 text-center text-sm opacity-60">
		&copy; {new Date().getFullYear()} Monika Schubert
	</div>
</footer>
