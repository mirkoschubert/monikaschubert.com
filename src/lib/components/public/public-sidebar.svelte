<script lang="ts">
  import { page } from '$app/state'
  import { localizeHref, deLocalizeUrl } from '$lib/paraglide/runtime'
  import * as m from '$lib/paraglide/messages.js'
  import * as Sidebar from '$lib/components/ui/sidebar'
  import {
    Images,
    BookOpen,
    Mail,
    CalendarDays,
    ScrollText,
    ShieldCheck
  } from '@lucide/svelte'

  const CATEGORIES = [
    { value: 'drawings', label: () => m.gallery_filter_drawings() },
    { value: 'portraits', label: () => m.gallery_filter_portraits() },
    { value: 'sculptures', label: () => m.gallery_filter_sculptures() },
    { value: 'religious-art', label: () => m.gallery_filter_religious_art() },
    { value: 'legends', label: () => m.gallery_filter_legends() },
    { value: 'reflections', label: () => m.gallery_filter_reflections() },
    { value: 'criticism', label: () => m.gallery_filter_criticism() }
  ] as const

  const currentPath = $derived(deLocalizeUrl(page.url).pathname)
  const isGalleryPage = $derived(currentPath === '/')
  const currentCategory = $derived(
    page.url.searchParams.get('category') ?? 'all'
  )
</script>

<Sidebar.Root collapsible="icon">
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton size="lg" tooltipContent="Monika Schubert">
          {#snippet child({ props })}
            <a href={localizeHref('/')} {...props}>
              <div
                class="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold"
              >
                MS
              </div>
              <div class="flex flex-col leading-tight">
                <span class="font-semibold">Monika Schubert</span>
                <span class="text-xs text-muted-foreground"
                  >{m.artist_tagline()}</span
                >
              </div>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>

  <Sidebar.Content>
    <!-- Gallery group: "All Pictures" always, categories only on homepage -->
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={isGalleryPage && currentCategory === 'all'}
              tooltipContent={m.gallery_filter_all()}
            >
              {#snippet child({ props })}
                <a href={localizeHref('/')} {...props}>
                  <Images />
                  <span>{m.gallery_filter_all()}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>

          {#if isGalleryPage}
            {#each CATEGORIES as cat, i}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  isActive={currentCategory === cat.value}
                  tooltipContent={cat.label()}
                >
                  {#snippet child({ props })}
                    <a
                      href={localizeHref(`/?category=${cat.value}`)}
                      {...props}
                    >
                      <span
                        class="font-mono text-xs tabular-nums opacity-50 w-4 shrink-0"
                        >{String(i + 1).padStart(2, '0')}</span
                      >
                      <span>{cat.label()}</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          {/if}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>

    <Sidebar.Separator />

    <!-- Other pages -->
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={currentPath.startsWith('/about')}
              tooltipContent={m.nav_about()}
            >
              {#snippet child({ props })}
                <a href={localizeHref('/about')} {...props}>
                  <BookOpen />
                  <span>{m.nav_about()}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={currentPath.startsWith('/exhibitions')}
              tooltipContent={m.studio_exhibitions()}
            >
              {#snippet child({ props })}
                <a href={localizeHref('/exhibitions')} {...props}>
                  <CalendarDays />
                  <span>{m.studio_exhibitions()}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={currentPath.startsWith('/contact')}
              tooltipContent={m.nav_contact()}
            >
              {#snippet child({ props })}
                <a href={localizeHref('/contact')} {...props}>
                  <Mail />
                  <span>{m.nav_contact()}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton tooltipContent={m.nav_imprint()}>
          {#snippet child({ props })}
            <a href={localizeHref('/imprint')} {...props}>
              <ScrollText />
              <span>{m.nav_imprint()}</span>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton tooltipContent={m.nav_privacy()}>
          {#snippet child({ props })}
            <a href={localizeHref('/privacy')} {...props}>
              <ShieldCheck />
              <span>{m.nav_privacy()}</span>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
    <div class="px-2 py-1 group-data-[collapsible=icon]:hidden">
      <p class="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Monika Schubert
      </p>
    </div>
  </Sidebar.Footer>

  <Sidebar.Rail />
</Sidebar.Root>
