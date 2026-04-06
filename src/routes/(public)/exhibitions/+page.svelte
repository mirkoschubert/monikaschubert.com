<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import { localize } from '$lib/types'
  import { getLocale } from '$lib/paraglide/runtime'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  const locale = getLocale()

  function formatDate(date: Date | string | null | undefined): string {
    if (!date) return ''
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
      year: 'numeric',
      month: 'long'
    }).format(new Date(date))
  }
</script>

<div class="mx-auto max-w-3xl px-4 py-12">
  <h1 class="mb-8 text-2xl font-semibold">{m.studio_exhibitions()}</h1>

  {#if data.exhibitions.length === 0}
    <p class="opacity-60"></p>
  {:else}
    <ul class="space-y-6">
      {#each data.exhibitions as ex (ex.id)}
        <li class="border-b pb-6 last:border-0">
          <h2 class="font-medium">{localize(ex.title, locale)}</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            {ex.location}
            {#if ex.dateFrom}
              &middot; {formatDate(ex.dateFrom)}{#if ex.dateTo}
                - {formatDate(ex.dateTo)}{/if}
            {/if}
          </p>
          {#if ex.description}
            <p class="mt-2 text-sm opacity-80">
              {localize(ex.description, locale)}
            </p>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
