<script lang="ts">
	import { marked } from 'marked'
	import { dev } from '$app/environment'
	import { getLocale } from '$lib/paraglide/runtime'
	import { localize } from '$lib/types'
	import type { LocalizedString } from '$lib/server/db/schema'

	let { title, content, heroImage = null }: {
		title: string
		content: LocalizedString | null
		heroImage?: string | null
	} = $props()

	const locale = getLocale()
	const html = $derived(content ? (marked(localize(content, locale)) as string) : '')

	// Vercel Image Optimization API - not available in dev
	function vercelImg(url: string, width: number, quality = 80): string {
		if (dev) return url
		return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
	}

	const widths = [640, 960, 1280, 1920, 2560]
	const heroSrcset = $derived(
		heroImage
			? widths.map((w) => `${vercelImg(heroImage!, w)} ${w}w`).join(', ')
			: ''
	)
</script>

{#if heroImage}
	<div class="w-full">
		<img
			src={vercelImg(heroImage, 1280)}
			srcset={heroSrcset}
			sizes="100vw"
			alt={title}
			class="h-64 w-full object-cover md:h-80 lg:h-96"
			loading="eager"
			fetchpriority="high"
		/>
	</div>
{/if}

<div class="mx-auto max-w-4xl px-6 py-12">
	<h1 class="mb-8 text-3xl font-semibold">{title}</h1>
	{#if html}
		<div class="prose prose-neutral dark:prose-invert max-w-none
			prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground/90
			prose-headings:text-foreground prose-headings:font-semibold
			prose-a:text-primary prose-a:no-underline hover:prose-a:underline
			prose-strong:text-foreground
			prose-li:text-base prose-li:text-foreground/90
			prose-blockquote:border-border prose-blockquote:text-muted-foreground
			prose-code:text-foreground prose-code:bg-muted prose-code:rounded prose-code:px-1"
		>{@html html}</div>
	{/if}
</div>
