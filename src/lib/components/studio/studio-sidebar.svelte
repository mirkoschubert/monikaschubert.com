<script lang="ts">
  import { page } from '$app/state'
  import * as m from '$lib/paraglide/messages.js'
  import * as Sidebar from '$lib/components/ui/sidebar'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import {
    Images,
    CalendarDays,
    LayoutDashboard,
    Users,
    ShieldCheck,
    Monitor,
    Settings,
    KeyRound,
    LogOut,
    ChevronUp,
    Shield,
    PanelLeft,
    FileText
  } from '@lucide/svelte'
  import type { LayoutData } from '../../../routes/(app)/$types'

  let { data }: { data: LayoutData } = $props()

  const initials = $derived(
    data.user.name
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  )
</script>

<Sidebar.Root collapsible="icon">
  <!-- Header: icon + text, icon stays visible when collapsed -->
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="lg" tooltipContent="Studio">
          {#snippet child({ props })}
            <a href="/" {...props}>
              <div
                class="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md"
              >
                <PanelLeft class="size-4" />
              </div>
              <div class="flex flex-col leading-tight">
                <span class="font-semibold">Studio</span>
                <span class="text-xs text-muted-foreground"
                  >monikaschubert.com</span
                >
              </div>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>

  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>{m.studio_nav_content()}</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={page.url.pathname.includes('/studio/dashboard')}
              tooltipContent={m.studio_dashboard()}
            >
              {#snippet child({ props })}
                <a href="/studio/dashboard" {...props}>
                  <LayoutDashboard />
                  <span>{m.studio_dashboard()}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={page.url.pathname.includes('/studio/gallery')}
              tooltipContent={m.studio_gallery()}
            >
              {#snippet child({ props })}
                <a href="/studio/gallery" {...props}>
                  <Images />
                  <span>{m.studio_gallery()}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={page.url.pathname.includes('/studio/exhibitions')}
              tooltipContent={m.studio_exhibitions()}
            >
              {#snippet child({ props })}
                <a href="/studio/exhibitions" {...props}>
                  <CalendarDays />
                  <span>{m.studio_exhibitions()}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={page.url.pathname.includes('/studio/pages')}
              tooltipContent={m.studio_pages()}
            >
              {#snippet child({ props })}
                <a href="/studio/pages" {...props}>
                  <FileText />
                  <span>{m.studio_pages()}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>

    {#if data.user.role === 'admin'}
      <Sidebar.Separator />

      <Sidebar.Group>
        <Sidebar.GroupLabel>{m.studio_nav_admin()}</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                isActive={page.url.pathname.includes('/studio/admin/users')}
                tooltipContent={m.studio_admin_users()}
              >
                {#snippet child({ props })}
                  <a href="/studio/admin/users" {...props}>
                    <Users />
                    <span>{m.studio_admin_users()}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                isActive={page.url.pathname.includes('/studio/admin/roles')}
                tooltipContent={m.studio_admin_roles()}
              >
                {#snippet child({ props })}
                  <a href="/studio/admin/roles" {...props}>
                    <ShieldCheck />
                    <span>{m.studio_admin_roles()}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                isActive={page.url.pathname.includes('/studio/admin/sessions')}
                tooltipContent={m.admin_sessions_title()}
              >
                {#snippet child({ props })}
                  <a href="/studio/admin/sessions" {...props}>
                    <Monitor />
                    <span>{m.admin_sessions_title()}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    {/if}
  </Sidebar.Content>

  <!-- Footer: avatar with initials (visible when collapsed), name + email when expanded -->
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Sidebar.MenuButton
                size="lg"
                tooltipContent={data.user.name}
                {...props}
              >
                <div
                  class="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                >
                  {initials}
                </div>
                <div class="flex min-w-0 flex-col leading-tight">
                  <span class="truncate font-medium">{data.user.name}</span>
                  <span class="truncate text-xs text-muted-foreground"
                    >{data.user.email}</span
                  >
                </div>
                <ChevronUp class="ml-auto shrink-0" />
              </Sidebar.MenuButton>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="top" class="w-56">
            <DropdownMenu.Item>
              {#snippet child({ props })}
                <a href="/studio/settings" {...props}>
                  <Settings class="size-4" />
                  {m.studio_settings()}
                </a>
              {/snippet}
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              {#snippet child({ props })}
                <a href="/studio/settings/passkeys" {...props}>
                  <KeyRound class="size-4" />
                  {m.studio_passkeys()}
                </a>
              {/snippet}
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              {#snippet child({ props })}
                <a href="/studio/settings/privacy" {...props}>
                  <Shield class="size-4" />
                  {m.studio_privacy()}
                </a>
              {/snippet}
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              variant="destructive"
              onSelect={() => {
                ;(
                  document.getElementById('signout-form') as HTMLFormElement
                )?.requestSubmit()
              }}
            >
              <LogOut class="size-4" />
              {m.studio_signout()}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>

  <Sidebar.Rail />
</Sidebar.Root>
