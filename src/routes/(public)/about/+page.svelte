<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import PageContent from '$lib/components/public/page-content.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PageContent title={m.nav_about()} content={data.page?.content ?? null} />
