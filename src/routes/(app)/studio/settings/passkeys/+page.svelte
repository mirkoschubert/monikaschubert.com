<script lang="ts">
  import { authClient } from '$lib/auth-client'
  import * as m from '$lib/paraglide/messages.js'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import * as Card from '$lib/components/ui/card'
  import * as Dialog from '$lib/components/ui/dialog'
  import { Badge } from '$lib/components/ui/badge'
  import { KeyRound, Plus, Trash2 } from '@lucide/svelte'

  type Passkey = {
    id: string
    name?: string | null
    deviceType: string
    backedUp: boolean
    createdAt?: Date | null
  }

  let passkeys = $state<Passkey[]>([])
  let loading = $state(true)
  let newName = $state('')
  let feedback = $state<{ type: 'success' | 'error'; message: string } | null>(
    null
  )
  let deleteTarget = $state<string | null>(null)

  async function loadPasskeys() {
    loading = true
    const result = await authClient.passkey.listUserPasskeys()
    if (result.data) passkeys = result.data as Passkey[]
    loading = false
  }

  async function addPasskey() {
    feedback = null
    const result = await authClient.passkey.addPasskey({
      name: newName.trim() || undefined
    })
    if (result && 'error' in result && result.error) {
      feedback = { type: 'error', message: m.studio_passkey_error() }
    } else {
      feedback = { type: 'success', message: m.studio_passkey_added() }
      newName = ''
      await loadPasskeys()
    }
  }

  async function deletePasskey() {
    if (!deleteTarget) return
    const result = await authClient.passkey.deletePasskey({ id: deleteTarget })
    deleteTarget = null
    if (result && 'error' in result && result.error) {
      feedback = { type: 'error', message: m.studio_passkey_error() }
    } else {
      feedback = { type: 'success', message: m.studio_passkey_deleted() }
      await loadPasskeys()
    }
  }

  $effect(() => {
    loadPasskeys()
  })
</script>

<div class="max-w-2xl space-y-6">
  <h1 class="text-2xl font-semibold">{m.studio_passkeys()}</h1>

  {#if feedback}
    <p
      class="text-sm {feedback.type === 'error'
        ? 'text-destructive'
        : 'text-green-500'}"
    >
      {feedback.message}
    </p>
  {/if}

  <!-- Add passkey -->
  <Card.Root>
    <Card.Header>
      <Card.Title class="flex items-center gap-2">
        <Plus class="size-4" />
        {m.studio_passkey_add()}
      </Card.Title>
      <Card.Description>{m.studio_passkey_hint()}</Card.Description>
    </Card.Header>
    <Card.Content class="flex gap-2">
      <Input
        bind:value={newName}
        placeholder={m.studio_passkey_name_placeholder()}
        class="max-w-xs"
      />
      <Button onclick={addPasskey}>{m.studio_passkey_add()}</Button>
    </Card.Content>
  </Card.Root>

  <!-- Existing passkeys -->
  <Card.Root>
    <Card.Header>
      <Card.Title class="flex items-center gap-2">
        <KeyRound class="size-4" />
        {m.studio_passkeys()}
      </Card.Title>
    </Card.Header>
    <Card.Content>
      {#if loading}
        <p class="text-sm text-muted-foreground">...</p>
      {:else if passkeys.length === 0}
        <p class="text-sm text-muted-foreground">{m.studio_passkey_hint()}</p>
      {:else}
        <ul class="space-y-2">
          {#each passkeys as pk (pk.id)}
            <li
              class="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <div class="flex items-center gap-3">
                <KeyRound class="size-4 text-muted-foreground" />
                <div>
                  <p class="text-sm font-medium">{pk.name ?? pk.deviceType}</p>
                  <p class="text-xs text-muted-foreground">
                    {m.studio_passkey_device_type()}: {pk.deviceType}
                    {#if pk.createdAt}
                      &middot; {new Date(pk.createdAt).toLocaleDateString()}
                    {/if}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                {#if pk.backedUp}
                  <Badge variant="outline" class="text-xs"
                    >{m.studio_passkey_backed_up()}</Badge
                  >
                {/if}
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 text-muted-foreground hover:text-destructive"
                  onclick={() => (deleteTarget = pk.id)}
                >
                  <Trash2 class="size-4" />
                </Button>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </Card.Content>
  </Card.Root>
</div>

<!-- Delete confirm dialog -->
<Dialog.Root
  open={!!deleteTarget}
  onOpenChange={(o) => {
    if (!o) deleteTarget = null
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.studio_passkey_delete_confirm()}</Dialog.Title>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (deleteTarget = null)}
        >{m.common_cancel()}</Button
      >
      <Button variant="destructive" onclick={deletePasskey}
        >{m.common_delete()}</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
