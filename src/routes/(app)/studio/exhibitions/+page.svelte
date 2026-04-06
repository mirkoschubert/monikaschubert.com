<script lang="ts">
  import { enhance } from '$app/forms'
  import * as m from '$lib/paraglide/messages.js'
  import { localize } from '$lib/types'
  import * as Table from '$lib/components/ui/table'
  import * as Dialog from '$lib/components/ui/dialog'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { Plus, Pencil, Trash2, Upload, X } from '@lucide/svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  let deleteTarget = $state<number | null>(null)
  let deleteOpen = $state(false)
  let pageImage = $derived(data.exhibitionPage?.imageUrl ?? '')
  let uploadedUrl = $state('')
  let uploading = $state(false)
  let uploadError = $state('')

  let currentImage = $derived(uploadedUrl || pageImage)

  async function handleImageUpload(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    uploading = true
    uploadError = ''
    try {
      const res = await fetch('/api/upload-image', {
        method: 'PUT',
        headers: {
          'content-type': file.type,
          'x-filename': file.name
        },
        body: file
      })
      if (!res.ok) throw new Error('Upload failed')
      const responseData = await res.json()
      uploadedUrl = responseData.url
    } catch {
      uploadError = m.exhibition_hero_upload_error()
    } finally {
      uploading = false
    }
  }

  function formatDate(date: Date | null | undefined): string {
    if (!date) return '-'
    return new Intl.DateTimeFormat('de-DE', { dateStyle: 'short' }).format(
      new Date(date)
    )
  }
  function typeLabel(type: string): string {
    const labels: Record<string, string> = {
      vernissage: m.exhibition_type_vernissage(),
      solo: m.exhibition_type_solo(),
      double: m.exhibition_type_double(),
      group: m.exhibition_type_group(),
      participation: m.exhibition_type_participation(),
      exhibition: m.exhibition_type_exhibition()
    }
    return labels[type] ?? type
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold">{m.studio_exhibitions()}</h1>
    {#if data.canCreate}
      <Button size="sm" href="/studio/exhibitions/new">
        <Plus class="mr-1 size-4" />
        {m.exhibition_new()}
      </Button>
    {/if}
  </div>

  <!-- Page image -->
  <div class="rounded-lg border border-border p-4">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-sm font-medium">{m.exhibition_image()}</h2>
      {#if currentImage}
        <form
          method="POST"
          action="?/updateImage"
          use:enhance={() => {
            uploadedUrl = ''
          }}
        >
          <input type="hidden" name="image_url" value="" />
          <Button type="submit" variant="ghost" size="sm">
            <X class="mr-1 size-4" />
            {m.exhibition_hero_remove()}
          </Button>
        </form>
      {/if}
    </div>

    <form
      method="POST"
      action="?/updateImage"
      use:enhance={() => {
        uploadedUrl = ''
        return async ({ update }) => {
          await update()
        }
      }}
    >
      {#if currentImage}
        <div
          class="relative mb-3 overflow-hidden rounded-md border border-border"
        >
          <img
            src={currentImage}
            alt="Exhibitions"
            class="w-full object-cover"
            style="aspect-ratio: 16/9"
          />
        </div>
      {/if}

      <input type="hidden" name="image_url" value={currentImage} />

      {#if uploadError}
        <p class="mb-2 text-xs text-destructive">{uploadError}</p>
      {/if}

      <div class="flex items-center gap-2">
        <label
          class="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground {uploading
            ? 'pointer-events-none opacity-50'
            : ''}"
        >
          <Upload class="size-4" />
          <span
            >{uploading
              ? m.exhibition_hero_uploading()
              : m.exhibition_hero_upload()}</span
          >
          <input
            type="file"
            accept="image/*"
            class="sr-only"
            disabled={uploading}
            onchange={handleImageUpload}
          />
        </label>
        <Button type="submit" size="sm" variant="outline">
          {m.common_save()}
        </Button>
      </div>
    </form>
  </div>

  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>{m.exhibition_title()}</Table.Head>
        <Table.Head>{m.exhibition_type()}</Table.Head>
        <Table.Head>{m.exhibition_location()}</Table.Head>
        <Table.Head>{m.exhibition_date_from()}</Table.Head>
        <Table.Head>{m.exhibition_date_to()}</Table.Head>
        <Table.Head>{m.exhibition_status()}</Table.Head>
        <Table.Head class="w-24">{m.common_actions()}</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each data.exhibitions as item (item.id)}
        <Table.Row
          class="cursor-pointer hover:bg-muted/50"
          onclick={() => {
            window.location.href = `/studio/exhibitions/${item.id}`
          }}
        >
          <Table.Cell class="font-medium"
            >{localize(item.title, 'en')}</Table.Cell
          >
          <Table.Cell>{typeLabel(item.type)}</Table.Cell>
          <Table.Cell>{localize(item.location, 'en')}</Table.Cell>
          <Table.Cell>{formatDate(item.dateFrom)}</Table.Cell>
          <Table.Cell>{formatDate(item.dateTo)}</Table.Cell>
          <Table.Cell>
            {#if item.status === 'published'}
              <Badge>{m.exhibition_status_published()}</Badge>
            {:else}
              <Badge variant="outline">{m.exhibition_status_draft()}</Badge>
            {/if}
          </Table.Cell>
          <Table.Cell onclick={(e) => e.stopPropagation()}>
            <div class="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                href="/studio/exhibitions/{item.id}"
                title={m.common_edit()}
              >
                <Pencil class="size-4" />
              </Button>
              {#if data.canDelete}
                <Button
                  variant="ghost"
                  size="icon"
                  title={m.exhibition_delete()}
                  onclick={() => {
                    deleteTarget = item.id
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
      <Dialog.Title>{m.exhibition_delete()}</Dialog.Title>
      <Dialog.Description>{m.exhibition_delete_confirm()}</Dialog.Description>
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
