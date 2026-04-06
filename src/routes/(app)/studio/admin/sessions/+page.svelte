<script lang="ts">
  import { enhance } from '$app/forms'
  import { invalidateAll } from '$app/navigation'
  import * as m from '$lib/paraglide/messages.js'
  import * as Table from '$lib/components/ui/table'
  import * as Dialog from '$lib/components/ui/dialog'
  import { Button } from '$lib/components/ui/button'
  import { LogOut } from '@lucide/svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
  let revokeTarget = $state<{ token: string; userName: string } | null>(null)
  let revokeAllTarget = $state<{ userId: string; userName: string } | null>(
    null
  )

  // Group sessions by user
  const grouped = $derived(() => {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const map = new Map<
      string,
      {
        userId: string
        userName: string
        userEmail: string
        sessions: typeof data.sessions
      }
    >()
    for (const s of data.sessions) {
      if (!map.has(s.userId)) {
        map.set(s.userId, {
          userId: s.userId,
          userName: s.userName,
          userEmail: s.userEmail,
          sessions: []
        })
      }
      map.get(s.userId)!.sessions.push(s)
    }
    return [...map.values()]
  })
</script>

<div class="max-w-5xl space-y-8">
  <h1 class="text-2xl font-semibold">{m.admin_sessions_title()}</h1>

  {#each grouped() as group (group.userId)}
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <div>
          <span class="font-medium">{group.userName}</span>
          <span class="ml-2 text-sm text-muted-foreground"
            >{group.userEmail}</span
          >
        </div>
        {#if data.canRevoke && group.sessions.length > 1}
          <Button
            variant="outline"
            size="sm"
            class="text-destructive hover:text-destructive"
            onclick={() =>
              (revokeAllTarget = {
                userId: group.userId,
                userName: group.userName
              })}
          >
            <LogOut class="size-4" />
            {m.admin_sessions_revoke_all()}
          </Button>
        {/if}
      </div>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>{m.admin_sessions_ip()}</Table.Head>
            <Table.Head>{m.admin_sessions_agent()}</Table.Head>
            <Table.Head>{m.admin_sessions_created()}</Table.Head>
            <Table.Head>{m.admin_sessions_expires()}</Table.Head>
            {#if data.canRevoke}
              <Table.Head class="w-12"></Table.Head>
            {/if}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each group.sessions as s (s.id)}
            <Table.Row>
              <Table.Cell class="text-sm text-muted-foreground"
                >{s.ipAddress ?? '-'}</Table.Cell
              >
              <Table.Cell
                class="max-w-64 truncate text-sm text-muted-foreground"
                title={s.userAgent ?? ''}
              >
                {s.userAgent ?? '-'}
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {new Date(s.createdAt).toLocaleString()}
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {new Date(s.expiresAt).toLocaleString()}
              </Table.Cell>
              {#if data.canRevoke}
                <Table.Cell>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-8 text-muted-foreground hover:text-destructive"
                    title={m.admin_sessions_revoke()}
                    onclick={() =>
                      (revokeTarget = { token: s.token, userName: s.userName })}
                  >
                    <LogOut class="size-4" />
                  </Button>
                </Table.Cell>
              {/if}
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
  {/each}
</div>

<!-- Revoke single session dialog -->
<Dialog.Root
  open={!!revokeTarget}
  onOpenChange={(o) => {
    if (!o) revokeTarget = null
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_sessions_revoke()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_sessions_revoke_confirm()}
        {#if revokeTarget}
          <span class="font-medium"> "{revokeTarget.userName}"</span>
        {/if}
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (revokeTarget = null)}
        >{m.common_cancel()}</Button
      >
      {#if revokeTarget}
        <form
          method="POST"
          action="?/revoke"
          use:enhance={() => {
            return async () => {
              revokeTarget = null
              await invalidateAll()
            }
          }}
        >
          <input type="hidden" name="token" value={revokeTarget.token} />
          <Button type="submit" variant="destructive"
            >{m.admin_sessions_revoke()}</Button
          >
        </form>
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Revoke all sessions dialog -->
<Dialog.Root
  open={!!revokeAllTarget}
  onOpenChange={(o) => {
    if (!o) revokeAllTarget = null
  }}
>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_sessions_revoke_all()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_sessions_revoke_all_confirm()}
        {#if revokeAllTarget}
          <span class="font-medium"> "{revokeAllTarget.userName}"</span>
        {/if}
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (revokeAllTarget = null)}
        >{m.common_cancel()}</Button
      >
      {#if revokeAllTarget}
        <form
          method="POST"
          action="?/revokeAll"
          use:enhance={() => {
            return async () => {
              revokeAllTarget = null
              await invalidateAll()
            }
          }}
        >
          <input type="hidden" name="userId" value={revokeAllTarget.userId} />
          <Button type="submit" variant="destructive"
            >{m.admin_sessions_revoke_all()}</Button
          >
        </form>
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
