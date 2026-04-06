<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import { marked } from '$lib/markdown'
  import { sanitizeHtml } from '$lib/sanitize'
  import { localize } from '$lib/types'
  import { getLocaleForUrl } from '$lib/paraglide/runtime'
  import { page } from '$app/state'
  import { vercelImg } from '$lib/utils/image'
  import { Badge } from '$lib/components/ui/badge'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  const locale = $derived(getLocaleForUrl(page.url.href))

  const widths = [640, 960, 1280, 1920, 2560]
  const heroImage = $derived(data.exhibitionPage?.imageUrl ?? null)
  const heroSrcset = $derived(
    heroImage
      ? widths.map((w) => `${vercelImg(heroImage!, w)} ${w}w`).join(', ')
      : ''
  )

  function formatDate(date: Date | string | null | undefined): string {
    if (!date) return ''
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  function renderMarkdown(text: string): string {
    return sanitizeHtml(marked.parse(text) as string)
  }

  const now = new Date()

  const upcoming = $derived(
    data.exhibitions.filter((ex) => new Date(ex.dateFrom) >= now)
  )

  const past = $derived(
    data.exhibitions.filter((ex) => new Date(ex.dateFrom) < now)
  )

  const pastByYear = $derived(() => {
    const grouped: Record<number, typeof past> = {}
    for (const ex of past) {
      const year = new Date(ex.dateFrom).getFullYear()
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(ex)
    }
    return Object.entries(grouped)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, items]) => ({ year: Number(year), items }))
  })

  function typeLabel(type: string): string {
    const key = `exhibition_type_${type}` as keyof typeof m
    const fn = m[key]
    return typeof fn === 'function' ? fn() : type
  }
</script>

{#if heroImage}
  <div class="relative w-full">
    <img
      src={vercelImg(heroImage, 1280)}
      srcset={heroSrcset}
      sizes="100vw"
      alt={m.studio_exhibitions()}
      class="h-64 w-full object-cover md:h-80 lg:h-96"
      loading="eager"
      fetchpriority="high"
    />
    <div
      class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
    ></div>
    <div class="absolute bottom-0 left-0 right-0">
      <div class="mx-auto max-w-4xl px-6 pb-8">
        <h1 class="text-[2.5rem] font-semibold tracking-tight text-white">
          {m.studio_exhibitions()}
        </h1>
      </div>
    </div>
  </div>
{/if}

<div class="mx-auto max-w-4xl px-6 py-12">
  {#if !heroImage}
    <h1 class="mb-12 text-3xl font-semibold tracking-tight">
      {m.studio_exhibitions()}
    </h1>
  {/if}

  <!-- Current & Upcoming -->
  <section class="mb-16">
    <h2 class="mb-6 text-xl font-semibold text-muted-foreground">
      {m.exhibition_current()}
    </h2>
    {#if upcoming.length === 0}
      <p class="text-sm opacity-60">{m.exhibition_no_upcoming()}</p>
    {:else}
      <div class="space-y-8">
        {#each upcoming as ex (ex.id)}
          <div class="rounded-lg border border-border p-6">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{typeLabel(ex.type)}</Badge>
              <span class="text-sm text-muted-foreground">
                {formatDate(ex.dateFrom)}{#if ex.dateTo}&nbsp;&dash; {formatDate(
                    ex.dateTo
                  )}{/if}
              </span>
            </div>
            <h3 class="text-lg font-medium">{localize(ex.title, locale)}</h3>
            <p class="mt-1 text-sm text-muted-foreground">
              {localize(ex.location, locale)}
            </p>
            {#if ex.description}
              <div class="page-prose mt-4">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html renderMarkdown(localize(ex.description, locale) ?? '')}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- Previous -->
  <section>
    <h2 class="mb-6 text-xl font-semibold text-muted-foreground">
      {m.exhibition_previous()}
    </h2>
    {#if pastByYear().length === 0}
      <p class="text-sm opacity-60">{m.exhibition_no_exhibitions()}</p>
    {:else}
      <div class="space-y-10">
        {#each pastByYear() as group (group.year)}
          <div>
            <h3 class="mb-4 text-lg font-semibold">{group.year}</h3>
            <ul class="space-y-3">
              {#each group.items as ex (ex.id)}
                <li
                  class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3"
                >
                  <Badge variant="outline" class="shrink-0 w-fit">
                    {typeLabel(ex.type)}
                  </Badge>
                  <span class="font-medium">{localize(ex.title, locale)}</span>
                  <span class="text-sm text-muted-foreground">
                    {localize(ex.location, locale)}
                  </span>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .page-prose :global(p) {
    font-size: 1rem;
    line-height: 1.75;
    color: oklch(0.88 0 0);
    margin-bottom: 1.25rem;
  }
  .page-prose :global(p:last-child) {
    margin-bottom: 0;
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
</style>
