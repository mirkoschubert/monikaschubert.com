<script lang="ts">
  import { marked } from '$lib/markdown'
  import { getLocale } from '$lib/paraglide/runtime'
  import { localize } from '$lib/types'
  import { vercelImg } from '$lib/utils/image'
  import type { LocalizedString } from '$lib/server/db/schema'

  let {
    title,
    content,
    heroImage = null
  }: {
    title: string
    content: LocalizedString | null
    heroImage?: string | null
  } = $props()

  const locale = getLocale()
  const html = $derived(
    content ? (marked.parse(localize(content, locale)) as string) : ''
  )

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
  <h1 class="mb-8 text-3xl font-semibold tracking-tight">{title}</h1>
  {#if html}
    <div class="page-prose">{@html html}</div>
  {/if}
</div>

<style>
  .page-prose :global(p) {
    font-size: 1rem;
    line-height: 1.75;
    color: oklch(0.88 0 0);
    margin-bottom: 1.25rem;
  }
  .page-prose :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: oklch(0.95 0 0);
    margin-top: 2.5rem;
    margin-bottom: 0.75rem;
    letter-spacing: -0.015em;
  }
  .page-prose :global(h3) {
    font-size: 1.2rem;
    font-weight: 600;
    color: oklch(0.95 0 0);
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
  .page-prose :global(h4),
  .page-prose :global(h5),
  .page-prose :global(h6) {
    font-size: 1rem;
    font-weight: 600;
    color: oklch(0.92 0 0);
    margin-top: 1.5rem;
    margin-bottom: 0.4rem;
  }
  .page-prose :global(a) {
    color: var(--rose-400);
    text-decoration: none;
    border-bottom: 1px solid var(--rose-700);
    transition:
      border-color 0.15s,
      color 0.15s;
  }
  .page-prose :global(a:hover) {
    color: var(--rose-300);
    border-bottom-color: var(--rose-500);
  }
  .page-prose :global(strong) {
    font-weight: 700;
    color: oklch(0.95 0 0);
  }
  .page-prose :global(em) {
    font-style: italic;
    color: oklch(0.85 0 0);
  }
  .page-prose :global(del) {
    text-decoration: line-through;
    color: oklch(0.55 0 0);
  }
  .page-prose :global(hr) {
    border: none;
    border-top: 1px solid oklch(1 0 0 / 12%);
    margin: 2.5rem 0;
  }
  .page-prose :global(ul) {
    list-style: disc;
    padding-left: 1.5rem;
    margin-bottom: 1.25rem;
    color: oklch(0.88 0 0);
  }
  .page-prose :global(ol) {
    list-style: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1.25rem;
    color: oklch(0.88 0 0);
  }
  .page-prose :global(li) {
    font-size: 1rem;
    line-height: 1.75;
    margin-bottom: 0.25rem;
  }
  .page-prose :global(li ul),
  .page-prose :global(li ol) {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  .page-prose :global(input[type='checkbox']) {
    accent-color: var(--rose-500);
    margin-right: 0.4rem;
  }
  .page-prose :global(blockquote) {
    border-left: 3px solid var(--rose-700);
    margin: 1.5rem 0;
    padding: 0.5rem 0 0.5rem 1.25rem;
    font-style: italic;
  }
  .page-prose :global(blockquote p) {
    color: oklch(0.7 0 0);
    margin-bottom: 0.5rem;
  }
  .page-prose :global(blockquote p:last-child) {
    margin-bottom: 0;
  }
  .page-prose :global(code) {
    font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
    font-size: 0.875em;
    background: oklch(1 0 0 / 7%);
    color: var(--rose-300);
    padding: 0.15em 0.4em;
    border-radius: 0.25rem;
    border: 1px solid oklch(1 0 0 / 10%);
  }
  .page-prose :global(pre) {
    background: oklch(0.16 0 0);
    border: 1px solid oklch(1 0 0 / 10%);
    border-radius: 0.5rem;
    padding: 1.25rem;
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }
  .page-prose :global(pre code) {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.875rem;
    color: oklch(0.88 0 0);
    line-height: 1.7;
  }
  .page-prose :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
    font-size: 0.9375rem;
  }
  .page-prose :global(thead tr) {
    border-bottom: 1px solid oklch(1 0 0 / 15%);
  }
  .page-prose :global(th) {
    text-align: left;
    font-weight: 600;
    color: oklch(0.95 0 0);
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .page-prose :global(td) {
    padding: 0.5rem 0.75rem;
    color: oklch(0.85 0 0);
    border-bottom: 1px solid oklch(1 0 0 / 7%);
  }
  .page-prose :global(tr:last-child td) {
    border-bottom: none;
  }
  /* Superscript / Subscript */
  .page-prose :global(sup),
  .page-prose :global(sub) {
    font-size: 0.75em;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  .page-prose :global(sup) {
    top: -0.5em;
  }
  .page-prose :global(sub) {
    bottom: -0.25em;
  }
  /* Highlight */
  .page-prose :global(mark) {
    background: var(--rose-950);
    color: var(--rose-200);
    padding: 0.1em 0.3em;
    border-radius: 0.2em;
  }
  /* Definition list */
  .page-prose :global(dl) {
    margin-bottom: 1.25rem;
  }
  .page-prose :global(dt) {
    font-weight: 600;
    color: oklch(0.92 0 0);
    margin-top: 0.75rem;
  }
  .page-prose :global(dd) {
    margin-left: 1.5rem;
    color: oklch(0.78 0 0);
    margin-bottom: 0.25rem;
  }
  /* Footnotes */
  .page-prose :global(.footnotes) {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid oklch(1 0 0 / 12%);
    font-size: 0.875rem;
    color: oklch(0.65 0 0);
  }
  .page-prose :global(.footnotes ol) {
    padding-left: 1.25rem;
  }
  .page-prose :global(.footnotes li) {
    margin-bottom: 0.4rem;
    color: oklch(0.65 0 0);
  }
  .page-prose :global(sup a),
  .page-prose :global(.footnotes a) {
    color: var(--rose-400);
    border-bottom: none;
    font-size: 0.75em;
  }
  .page-prose :global(sup a:hover),
  .page-prose :global(.footnotes a:hover) {
    color: var(--rose-300);
  }
</style>
