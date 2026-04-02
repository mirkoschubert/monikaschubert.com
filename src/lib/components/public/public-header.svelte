<script lang="ts">
  import { page } from '$app/state'
  import {
    locales,
    localizeHref,
    deLocalizeUrl,
    getLocaleForUrl
  } from '$lib/paraglide/runtime'
  import * as m from '$lib/paraglide/messages.js'
  import * as Sidebar from '$lib/components/ui/sidebar'
  import { Separator } from '$lib/components/ui/separator'
  import { PanelLeft, Home } from '@lucide/svelte'

  let { user }: { user: { name: string } | null } = $props()

  const currentPath = $derived(deLocalizeUrl(page.url).pathname)

  const breadcrumbLabel = $derived(() => {
    if (currentPath.startsWith('/about')) return m.nav_about()
    if (currentPath.startsWith('/exhibitions')) return m.studio_exhibitions()
    if (currentPath.startsWith('/contact')) return m.nav_contact()
    if (currentPath.startsWith('/imprint')) return m.nav_imprint()
    if (currentPath.startsWith('/privacy')) return m.nav_privacy()
    if (currentPath.startsWith('/gallery/')) return m.studio_gallery()
    return m.gallery_filter_all()
  })
</script>

<header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
  <Sidebar.Trigger class="-ml-1" />
  <Separator orientation="vertical" class="mx-1 h-4" />
  <nav class="flex items-center gap-1 text-sm text-muted-foreground">
    <a href={localizeHref('/')} class="hover:text-foreground transition-colors">
      <Home class="size-4" />
    </a>
    {#if currentPath !== '/'}
      <span>/</span>
      <span class="text-foreground">{breadcrumbLabel()}</span>
    {/if}
  </nav>

  <div class="ml-auto flex items-center gap-3">
    {#if user}
      <a
        href="/studio/dashboard"
        class="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <PanelLeft class="size-4" />
        <span class="hidden sm:inline">Studio</span>
      </a>
      <Separator orientation="vertical" class="h-4" />
    {/if}
    <div class="flex items-center gap-1 text-xs text-muted-foreground">
      {#each locales as locale}
        <a
          href={localizeHref(deLocalizeUrl(page.url).pathname, { locale })}
          class="px-1 uppercase transition-colors hover:text-foreground {getLocaleForUrl(
            page.url.href
          ) === locale
            ? 'text-foreground font-medium'
            : ''}">{locale}</a
        >
        {#if locale !== locales[locales.length - 1]}
          <span class="opacity-30">|</span>
        {/if}
      {/each}
    </div>
  </div>
</header>
