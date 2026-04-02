<script lang="ts">
  import '../app.css'
  import favicon from '$lib/assets/favicon.svg'
  import { page } from '$app/state'
  import {
    overwriteGetLocale,
    overwriteSetLocale,
    getLocaleForUrl,
    localStorageKey,
    baseLocale,
    type Locale
  } from '$lib/paraglide/runtime'

  let { children } = $props()

  // For studio/auth routes (not in urlPatterns), locale is stored in a
  // reactive $state variable so switching is instant without a page reload.
  // localStorage persists the choice across sessions without using cookies.
  function readLocalStorage(): Locale | undefined {
    if (typeof localStorage === 'undefined') return undefined
    const val = localStorage.getItem(localStorageKey)
    return val === 'en' || val === 'de' ? val : undefined
  }

  let studioLocale = $state<Locale>(readLocalStorage() ?? baseLocale)

  overwriteGetLocale(() => {
    try {
      return getLocaleForUrl(page.url.href)
    } catch {
      return studioLocale
    }
  })

  overwriteSetLocale((locale) => {
    studioLocale = locale
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(localStorageKey, locale)
    }
  })
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{#key studioLocale}
  {@render children()}
{/key}
