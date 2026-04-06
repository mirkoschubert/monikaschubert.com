<script lang="ts">
  import { getLocale } from '$lib/paraglide/runtime'
  import { localize } from '$lib/types'
  import { vercelImg } from '$lib/utils/image'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
  let locale = getLocale()
</script>

<div class="mx-auto max-w-5xl px-4 py-12">
  {#if data.artworks.length === 0}
    <p class="text-center opacity-60">No works published yet.</p>
  {:else}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.artworks as work, i (work.id)}
        <a href="/gallery/{work.slug}" class="group block">
          <div class="aspect-square overflow-hidden bg-muted">
            <img
              src={vercelImg(work.imageUrl, 640)}
              alt={localize(work.title, locale)}
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchpriority={i === 0 ? 'high' : 'auto'}
              width="640"
              height="640"
            />
          </div>
          <div class="mt-2">
            <p class="font-medium">{localize(work.title, locale)}</p>
            {#if work.year}
              <p class="text-sm opacity-60">{work.year}</p>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
