<script lang="ts">
	import { locales, localizeHref, deLocalizeUrl } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import PublicSidebar from '$lib/components/public/public-sidebar.svelte';
	import PublicHeader from '$lib/components/public/public-header.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<svelte:head>
	{#each locales as locale}
		<link rel="alternate" hreflang={locale} href={localizeHref(deLocalizeUrl(page.url).pathname, { locale })} />
	{/each}
</svelte:head>

<Sidebar.Provider>
	<PublicSidebar />

	<Sidebar.Inset>
		<PublicHeader user={data.user} />

		<main>
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
