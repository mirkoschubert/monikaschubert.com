<script lang="ts">
  import { getLocale, localizeHref } from '$lib/paraglide/runtime'
  import { localize } from '$lib/types'
  import { vercelImg } from '$lib/utils/image'
  import * as m from '$lib/paraglide/messages.js'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
  let locale = getLocale()
</script>

<div class="mx-auto max-w-3xl px-4 py-12">
  <a
    href={localizeHref('/')}
    class="mb-8 inline-block text-sm opacity-60 hover:opacity-100"
  >
    &larr; {m.common_back()}
  </a>

  <div class="mb-8 overflow-hidden bg-muted">
    <img
      src={vercelImg(data.artwork.imageUrl, 1280)}
      srcset="{vercelImg(data.artwork.imageUrl, 640)} 640w, {vercelImg(
        data.artwork.imageUrl,
        960
      )} 960w, {vercelImg(data.artwork.imageUrl, 1280)} 1280w"
      sizes="(max-width: 768px) 100vw, 768px"
      alt={localize(data.artwork.title, locale)}
      class="w-full object-contain"
      loading="eager"
      fetchpriority="high"
    />
  </div>

  <h1 class="text-2xl font-semibold">{localize(data.artwork.title, locale)}</h1>

  <dl class="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
    {#if data.artwork.year}
      <div>
        <dt class="opacity-60">{m.artwork_year()}</dt>
        <dd>{data.artwork.year}</dd>
      </div>
    {/if}
    {#if data.artwork.medium}
      <div>
        <dt class="opacity-60">{m.artwork_medium()}</dt>
        <dd>{data.artwork.medium}</dd>
      </div>
    {/if}
    {#if data.artwork.dimensions}
      <div>
        <dt class="opacity-60">{m.artwork_dimensions()}</dt>
        <dd>{data.artwork.dimensions}</dd>
      </div>
    {/if}
  </dl>

  {#if data.artwork.description}
    <p class="mt-6 leading-relaxed">
      {localize(data.artwork.description, locale)}
    </p>
  {/if}
</div>
