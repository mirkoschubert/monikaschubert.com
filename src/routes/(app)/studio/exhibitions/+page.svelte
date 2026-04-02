<script lang="ts">
  import * as m from '$lib/paraglide/messages.js'
  import { localize } from '$lib/types'
  import { getLocaleForUrl } from '$lib/paraglide/runtime'
  import { page } from '$app/state'
  import { Badge } from '$lib/components/ui/badge'
  import * as Table from '$lib/components/ui/table'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
  const locale = $derived(getLocaleForUrl(page.url.href))

  function formatDate(date: Date | null | undefined): string {
    if (!date) return '-'
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }
</script>

<div class="max-w-4xl">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-semibold">{m.studio_exhibitions()}</h1>
  </div>

  {#if data.exhibitions.length === 0}
    <p class="opacity-60">No exhibitions yet.</p>
  {:else}
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>{m.exhibition_title()}</Table.Head>
          <Table.Head>{m.exhibition_location()}</Table.Head>
          <Table.Head>{m.exhibition_date_from()}</Table.Head>
          <Table.Head>{m.exhibition_date_to()}</Table.Head>
          <Table.Head>{m.exhibition_published()}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each data.exhibitions as item}
          <Table.Row>
            <Table.Cell class="font-medium"
              >{localize(item.title, locale)}</Table.Cell
            >
            <Table.Cell>{item.location}</Table.Cell>
            <Table.Cell>{formatDate(item.dateFrom)}</Table.Cell>
            <Table.Cell>{formatDate(item.dateTo)}</Table.Cell>
            <Table.Cell>
              {#if item.published}
                <Badge>{m.exhibition_published()}</Badge>
              {:else}
                <Badge variant="outline">Draft</Badge>
              {/if}
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  {/if}
</div>
