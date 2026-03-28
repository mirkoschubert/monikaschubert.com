<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { overwriteGetLocale, getLocaleForUrl } from '$lib/paraglide/runtime';

	let { children } = $props();

	// Make all m.*() message functions reactive to URL-based locale changes.
	// getLocaleForUrl() reads from the reactive page.url, so any locale
	// switch via URL navigation re-evaluates all translations automatically.
	overwriteGetLocale(() => getLocaleForUrl(page.url.href));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
