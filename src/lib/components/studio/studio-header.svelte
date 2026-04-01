<script lang="ts">
	import { page } from '$app/state'
	import * as m from '$lib/paraglide/messages.js'
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime'
	import * as Sidebar from '$lib/components/ui/sidebar'
	import { Separator } from '$lib/components/ui/separator'
	import { LogOut } from '@lucide/svelte'
	const breadcrumbLabel = $derived(() => {
		const path = page.url.pathname
		if (path.startsWith('/studio/gallery')) return m.studio_gallery()
		if (path.startsWith('/studio/exhibitions')) return m.studio_exhibitions()
		if (path.startsWith('/studio/pages')) return m.studio_pages()
		if (path.startsWith('/studio/admin/users')) return m.studio_admin_users()
		if (path.startsWith('/studio/admin/roles')) return m.studio_admin_roles()
		if (path.startsWith('/studio/admin/sessions')) return m.admin_sessions_title()
		if (path.startsWith('/studio/settings')) return m.studio_settings()
		return m.studio_dashboard()
	})
</script>

<header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
	<Sidebar.Trigger class="-ml-1" />
	<Separator orientation="vertical" class="mx-1 h-4" />
	<nav class="flex items-center gap-1 text-sm text-muted-foreground">
		<a href="/studio/dashboard" class="transition-colors hover:text-foreground">Studio</a>
		<span>/</span>
		<span class="text-foreground">{breadcrumbLabel()}</span>
	</nav>

	<div class="ml-auto flex items-center gap-3">
		<!-- Language switcher -->
		<div class="flex items-center gap-1 text-xs text-muted-foreground">
			{#each locales as locale}
				<button
					onclick={() => setLocale(locale, { reload: false })}
					class="px-1 uppercase transition-colors hover:text-foreground {getLocale() === locale ? 'text-foreground font-medium' : ''}"
				>
					{locale}
				</button>
				{#if locale !== locales[locales.length - 1]}
					<span class="opacity-30">|</span>
				{/if}
			{/each}
		</div>

		<Separator orientation="vertical" class="h-4" />

		<!-- Sign out -->
		<form id="signout-form" method="POST" action="/studio/dashboard?/signOut" class="hidden"></form>
		<button
			onclick={() => (document.getElementById('signout-form') as HTMLFormElement)?.requestSubmit()}
			class="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<LogOut class="size-4" />
			<span class="hidden sm:inline">{m.studio_signout()}</span>
		</button>
	</div>
</header>
