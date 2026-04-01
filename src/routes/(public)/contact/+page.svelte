<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import PageContent from '$lib/components/public/page-content.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PageContent title={m.nav_contact()} content={data.page?.content ?? null} heroImage={data.page?.heroImage ?? null} />
