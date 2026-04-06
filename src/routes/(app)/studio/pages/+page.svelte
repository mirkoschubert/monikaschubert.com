<script lang="ts">
  import { enhance } from '$app/forms'
  import * as m from '$lib/paraglide/messages.js'
  import { localize } from '$lib/types'
  import * as Table from '$lib/components/ui/table'
  import * as Dialog from '$lib/components/ui/dialog'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Plus, Pencil, Trash2 } from '@lucide/svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  let deleteTarget = $state<number | null>(null)
  let deleteOpen = $state(false)

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('de-DE', { dateStyle: 'short' }).format(
      new Date(date)
    )
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold">{m.studio_pages()}</h1>
    {#if data.canCreate}
      <Button size="sm" href="/studio/pages/new">
        <Plus class="mr-1 size-4" />
        {m.pages_new()}
      </Button>
    {/if}
  </div>

  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>{m.pages_col_title()}</Table.Head>
        <Table.Head>{m.pages_col_slug()}</Table.Head>
        <Table.Head>{m.pages_col_status()}</Table.Head>
        <Table.Head>{m.pages_col_updated()}</Table.Head>
        <Table.Head class="w-24">{m.common_actions()}</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each data.pages as p (p.id)}
        <Table.Row
          class="cursor-pointer hover:bg-muted/50"
          onclick={() => {
            window.location.href = `/studio/pages/${p.id}`
          }}
        >
          <Table.Cell class="font-medium">{localize(p.title, 'en')}</Table.Cell>
          <Table.Cell class="text-muted-foreground">{p.slug}</Table.Cell>
          <Table.Cell>
            {#if p.status === 'published'}
              <Badge>{m.pages_status_published()}</Badge>
            {:else}
              <Badge variant="outline">{m.pages_status_draft()}</Badge>
            {/if}
          </Table.Cell>
          <Table.Cell class="text-muted-foreground"
            >{formatDate(p.updatedAt)}</Table.Cell
          >
          <Table.Cell onclick={(e) => e.stopPropagation()}>
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                href="/studio/pages/{p.id}"
                title={m.common_edit()}
              >
                <Pencil class="size-4" />
              </Button>
              {#if data.canDelete}
                <Button
                  variant="ghost"
                  size="icon"
                  title={m.pages_delete()}
                  onclick={() => {
                    deleteTarget = p.id
                    deleteOpen = true
                  }}
                >
                  <Trash2 class="size-4" />
                </Button>
              {/if}
            </div>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>

<Dialog.Root bind:open={deleteOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.pages_delete()}</Dialog.Title>
      <Dialog.Description>{m.pages_delete_confirm()}</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button
        variant="outline"
        onclick={() => {
          deleteOpen = false
          deleteTarget = null
        }}
      >
        {m.common_cancel()}
      </Button>
      <form
        method="POST"
        action="?/delete"
        use:enhance={() => () => {
          deleteOpen = false
          deleteTarget = null
        }}
      >
        <input type="hidden" name="id" value={deleteTarget} />
        <Button type="submit" variant="destructive">{m.common_delete()}</Button>
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
