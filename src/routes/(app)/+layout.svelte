<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import { locales, localizeHref, deLocalizeUrl, getLocaleForUrl } from '$lib/paraglide/runtime';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Images,
		CalendarDays,
		LayoutDashboard,
		Users,
		Settings,
		KeyRound,
		LogOut,
		ChevronUp,
		Shield,
		PanelLeft
	} from '@lucide/svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// Initials from user name
	const initials = $derived(
		data.user.name
			.split(' ')
			.map((n: string) => n[0])
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);

	const breadcrumbLabel = $derived(() => {
		const path = page.url.pathname.replace(/^\/de\//, '/');
		if (path.startsWith('/studio/gallery')) return m.studio_gallery();
		if (path.startsWith('/studio/exhibitions')) return m.studio_exhibitions();
		if (path.startsWith('/studio/admin/users')) return m.studio_admin_users();
		if (path.startsWith('/studio/settings')) return m.studio_settings();
		return m.studio_dashboard();
	});

	async function signOut() {
		await goto('/studio/dashboard?/signOut', { invalidateAll: true });
	}
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="icon">

		<!-- Header: icon + text, icon stays visible when collapsed -->
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="lg" tooltipContent="Studio">
						{#snippet child({ props })}
							<a href="/studio/dashboard" {...props}>
								<div class="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
									<PanelLeft class="size-4" />
								</div>
								<div class="flex flex-col leading-tight">
									<span class="font-semibold">Studio</span>
									<span class="text-xs text-muted-foreground">monikaschubert.com</span>
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
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>

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
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>

		<!-- Footer: avatar with initials (visible when collapsed), name + email when expanded -->
		<Sidebar.Footer>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton size="lg" tooltipContent={data.user.name} {...props}>
									<div class="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
										{initials}
									</div>
									<div class="flex min-w-0 flex-col leading-tight">
										<span class="truncate font-medium">{data.user.name}</span>
										<span class="truncate text-xs text-muted-foreground">{data.user.email}</span>
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
									(document.getElementById('signout-form') as HTMLFormElement)?.requestSubmit();
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

	<Sidebar.Inset>
		<header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mx-1 h-4" />
			<nav class="flex items-center gap-1 text-sm text-muted-foreground">
				<span>Studio</span>
				<span>/</span>
				<span class="text-foreground">{breadcrumbLabel()}</span>
			</nav>

			<div class="ml-auto flex items-center gap-3">
				<!-- Language switcher -->
				<div class="flex items-center gap-1 text-xs text-muted-foreground">
					{#each locales as locale}
						<a
							href={localizeHref(deLocalizeUrl(page.url).pathname, { locale })}
							class="px-1 uppercase transition-colors hover:text-foreground {getLocaleForUrl(page.url.href) === locale ? 'text-foreground font-medium' : ''}"
						>
							{locale}
						</a>
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

		<main class="flex flex-1 flex-col gap-4 p-6">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
