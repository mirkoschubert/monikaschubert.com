<script lang="ts">
	import { enhance } from '$app/forms'
	import * as m from '$lib/paraglide/messages.js'
	import * as Tabs from '$lib/components/ui/tabs'
	import * as Card from '$lib/components/ui/card'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import { Badge } from '$lib/components/ui/badge'
	import { ChevronLeft, Upload, X } from '@lucide/svelte'
	import { untrack } from 'svelte'
	import MarkdownEditor from '$lib/components/studio/markdown-editor.svelte'
	import type { PageData, ActionData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()

	const isNew = $derived(data.page === null)
	let titleEn = $state(untrack(() => data.page?.title?.en ?? ''))
	let titleDe = $state(untrack(() => data.page?.title?.de ?? ''))
	let slug = $state(untrack(() => data.page?.slug ?? ''))
	let contentEn = $state(untrack(() => data.page?.content?.en ?? ''))
	let contentDe = $state(untrack(() => data.page?.content?.de ?? ''))
	let heroImage = $state(untrack(() => data.page?.heroImage ?? ''))
	let seoTitleEn = $state(untrack(() => data.page?.seoTitle?.en ?? ''))
	let seoTitleDe = $state(untrack(() => data.page?.seoTitle?.de ?? ''))
	let seoDescEn = $state(untrack(() => data.page?.seoDescription?.en ?? ''))
	let seoDescDe = $state(untrack(() => data.page?.seoDescription?.de ?? ''))

	// Auto-generate slug from EN title on new pages
	let slugEdited = $state(false)
	$effect(() => {
		if (isNew && !slugEdited) {
			slug = titleEn
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '')
		}
	})

	const errorMessage = $derived(() => {
		if (!form?.error) return null
		if (form.error === 'title_required') return m.pages_error_title_required()
		if (form.error === 'slug_required') return m.pages_error_slug_required()
		if (form.error === 'slug_taken') return m.pages_error_slug_taken()
		return null
	})

	// Hero image upload
	let uploading = $state(false)
	let uploadError = $state('')

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
					'x-filename': file.name,
				},
				body: file,
			})
			if (!res.ok) throw new Error('Upload failed')
			const data = await res.json()
			heroImage = data.url
		} catch {
			uploadError = m.pages_hero_upload_error()
		} finally {
			uploading = false
		}
	}

	// SEO limits: title 50-60 chars, description 150-160 chars
	const SEO_TITLE_MAX = 60
	const SEO_DESC_MAX = 160

	function seoTitleClass(val: string) {
		if (val.length > SEO_TITLE_MAX) return 'text-destructive'
		if (val.length > 50) return 'text-yellow-500'
		return 'text-muted-foreground'
	}
	function seoDescClass(val: string) {
		if (val.length > SEO_DESC_MAX) return 'text-destructive'
		if (val.length > 150) return 'text-yellow-500'
		return 'text-muted-foreground'
	}
</script>

<div class="space-y-4">
	<div class="flex items-center gap-4">
		<Button variant="ghost" size="sm" href="/studio/pages">
			<ChevronLeft class="mr-1 size-4" />
			{m.pages_back()}
		</Button>
		<h1 class="text-2xl font-semibold">{isNew ? m.pages_new() : m.pages_edit()}</h1>
	</div>

	{#if form?.success}
		<p class="text-sm text-green-500">{m.pages_saved()}</p>
	{/if}
	{#if errorMessage()}
		<p class="text-sm text-destructive">{errorMessage()}</p>
	{/if}

	<form method="POST" use:enhance={() => {
		return async ({ update, result }) => {
			await update()
			if (result.type === 'success' && result.data?.success) {
				titleEn = data.page?.title?.en ?? ''
				titleDe = data.page?.title?.de ?? ''
				slug = data.page?.slug ?? ''
				contentEn = data.page?.content?.en ?? ''
				contentDe = data.page?.content?.de ?? ''
				heroImage = data.page?.heroImage ?? ''
				seoTitleEn = data.page?.seoTitle?.en ?? ''
				seoTitleDe = data.page?.seoTitle?.de ?? ''
				seoDescEn = data.page?.seoDescription?.en ?? ''
				seoDescDe = data.page?.seoDescription?.de ?? ''
			}
		}
	}}>
		<div class="flex flex-col gap-6 lg:flex-row lg:items-start">

			<!-- Left column: title + content -->
			<div class="min-w-0 flex-1 space-y-4">
				<Tabs.Root value="en">
					<Tabs.List>
						<Tabs.Trigger value="en">{m.pages_tab_en()}</Tabs.Trigger>
						<Tabs.Trigger value="de">{m.pages_tab_de()}</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="en" class="space-y-4 pt-4">
						<div class="space-y-1.5">
							<Label for="title_en">{m.pages_field_title()}</Label>
							<Input id="title_en" name="title_en" bind:value={titleEn} />
						</div>
						<div class="space-y-1.5">
							<Label>{m.pages_field_content()}</Label>
							<MarkdownEditor name="content_en" bind:value={contentEn} rows={20} />
						</div>
					</Tabs.Content>

					<Tabs.Content value="de" class="space-y-4 pt-4">
						<div class="space-y-1.5">
							<Label for="title_de">{m.pages_field_title()}</Label>
							<Input id="title_de" name="title_de" bind:value={titleDe} />
						</div>
						<div class="space-y-1.5">
							<Label>{m.pages_field_content()}</Label>
							<MarkdownEditor name="content_de" bind:value={contentDe} rows={20} />
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</div>

			<!-- Right column: sidebar cards -->
			<div class="w-full space-y-4 lg:w-72 lg:shrink-0">

				<!-- Card 1: Actions + Slug + Status -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-sm font-medium">{m.pages_card_publish()}</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="flex flex-col gap-2">
							{#if data.page?.status === 'published'}
								<Button type="submit" formaction="?/publish" class="w-full">
									{m.pages_update()}
								</Button>
								<Button type="submit" formaction="?/saveDraft" variant="outline" class="w-full">
									{m.pages_back_to_draft()}
								</Button>
							{:else}
								<Button type="submit" formaction="?/publish" class="w-full">
									{m.pages_publish()}
								</Button>
								<Button type="submit" formaction="?/saveDraft" variant="outline" class="w-full">
									{m.pages_save_draft()}
								</Button>
							{/if}
						</div>
						<div class="border-t border-border pt-3 space-y-3">
							<div class="space-y-1.5">
								<Label for="slug">{m.pages_field_slug()}</Label>
								<Input
									id="slug"
									name="slug"
									bind:value={slug}
									oninput={() => { slugEdited = true }}
									placeholder="e.g. about"
								/>
							</div>
							<div class="flex items-center gap-2">
								<span class="text-sm text-muted-foreground">{m.pages_col_status()}:</span>
								{#if data.page?.status === 'published'}
									<Badge>{m.pages_status_published()}</Badge>
								{:else}
									<Badge variant="outline">{m.pages_status_draft()}</Badge>
								{/if}
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Card 2: Hero Image -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-sm font-medium">{m.pages_field_hero_image()}</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-3">
						<!-- Hidden field carries the URL into the form -->
						<input type="hidden" name="hero_image" value={heroImage} />

						{#if heroImage}
							<div class="relative overflow-hidden rounded-md border border-border">
								<img src={heroImage} alt="Hero" class="w-full object-cover" style="aspect-ratio: 16/9" />
								<button
									type="button"
									onclick={() => { heroImage = '' }}
									class="absolute right-2 top-2 flex size-7 items-center justify-center rounded-md bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
									title={m.pages_hero_remove()}
								>
									<X class="size-4" />
								</button>
							</div>
						{/if}

						{#if uploadError}
							<p class="text-xs text-destructive">{uploadError}</p>
						{/if}

						<label class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground {uploading ? 'pointer-events-none opacity-50' : ''}">
							<Upload class="size-4" />
							<span>{uploading ? m.pages_hero_uploading() : m.pages_hero_upload()}</span>
							<input
								type="file"
								accept="image/*"
								class="sr-only"
								disabled={uploading}
								onchange={handleImageUpload}
							/>
						</label>
					</Card.Content>
				</Card.Root>

				<!-- Card 3: SEO -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-sm font-medium">{m.pages_card_seo()}</Card.Title>
					</Card.Header>
					<Card.Content>
						<Tabs.Root value="en">
							<Tabs.List>
								<Tabs.Trigger value="en">{m.pages_tab_en()}</Tabs.Trigger>
								<Tabs.Trigger value="de">{m.pages_tab_de()}</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Content value="en" class="space-y-3 pt-4">
								<div class="space-y-1.5">
									<div class="flex items-center justify-between">
										<Label for="seo_title_en">{m.pages_field_seo_title()}</Label>
										<span class="text-xs {seoTitleClass(seoTitleEn)}">
											{seoTitleEn.length}/{SEO_TITLE_MAX}{#if seoTitleEn.length > SEO_TITLE_MAX} - too long{/if}
										</span>
									</div>
									<Input id="seo_title_en" name="seo_title_en" bind:value={seoTitleEn} />
								</div>
								<div class="space-y-1.5">
									<div class="flex items-center justify-between">
										<Label for="seo_description_en">{m.pages_field_seo_description()}</Label>
										<span class="text-xs {seoDescClass(seoDescEn)}">
											{seoDescEn.length}/{SEO_DESC_MAX}{#if seoDescEn.length > SEO_DESC_MAX} - too long{/if}
										</span>
									</div>
									<textarea
										id="seo_description_en"
										name="seo_description_en"
										rows="3"
										bind:value={seoDescEn}
										class="w-full rounded-md border bg-transparent px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									></textarea>
								</div>
							</Tabs.Content>
							<Tabs.Content value="de" class="space-y-3 pt-4">
								<div class="space-y-1.5">
									<div class="flex items-center justify-between">
										<Label for="seo_title_de">{m.pages_field_seo_title()}</Label>
										<span class="text-xs {seoTitleClass(seoTitleDe)}">
											{seoTitleDe.length}/{SEO_TITLE_MAX}{#if seoTitleDe.length > SEO_TITLE_MAX} - too long{/if}
										</span>
									</div>
									<Input id="seo_title_de" name="seo_title_de" bind:value={seoTitleDe} />
								</div>
								<div class="space-y-1.5">
									<div class="flex items-center justify-between">
										<Label for="seo_description_de">{m.pages_field_seo_description()}</Label>
										<span class="text-xs {seoDescClass(seoDescDe)}">
											{seoDescDe.length}/{SEO_DESC_MAX}{#if seoDescDe.length > SEO_DESC_MAX} - too long{/if}
										</span>
									</div>
									<textarea
										id="seo_description_de"
										name="seo_description_de"
										rows="3"
										bind:value={seoDescDe}
										class="w-full rounded-md border bg-transparent px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									></textarea>
								</div>
							</Tabs.Content>
						</Tabs.Root>
					</Card.Content>
				</Card.Root>

			</div>
		</div>
	</form>
</div>
