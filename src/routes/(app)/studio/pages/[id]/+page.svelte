<script lang="ts">
	import { enhance } from '$app/forms'
	import * as m from '$lib/paraglide/messages.js'
	import * as Tabs from '$lib/components/ui/tabs'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import { ChevronLeft } from '@lucide/svelte'
	import { untrack } from 'svelte'
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
</script>

<div class="max-w-3xl space-y-6">
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

	<form method="POST" use:enhance={({ formElement, cancel }) => {
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
	}} class="space-y-6">
		<!-- Slug (not localized) -->
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

		<!-- Hero image (not localized) -->
		<div class="space-y-1.5">
			<Label for="hero_image">{m.pages_field_hero_image()}</Label>
			<Input
				id="hero_image"
				name="hero_image"
				bind:value={heroImage}
				placeholder="https://..."
			/>
		</div>

		<!-- Localized fields in tabs -->
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
					<Label for="content_en">{m.pages_field_content()}</Label>
					<textarea
						id="content_en"
						name="content_en"
						rows="12"
						bind:value={contentEn}
						class="w-full rounded-md border bg-transparent px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					></textarea>
				</div>
				<div class="space-y-1.5">
					<Label for="seo_title_en">{m.pages_field_seo_title()}</Label>
					<Input id="seo_title_en" name="seo_title_en" bind:value={seoTitleEn} />
				</div>
				<div class="space-y-1.5">
					<Label for="seo_description_en">{m.pages_field_seo_description()}</Label>
					<textarea
						id="seo_description_en"
						name="seo_description_en"
						rows="3"
						bind:value={seoDescEn}
						class="w-full rounded-md border bg-transparent px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					></textarea>
				</div>
			</Tabs.Content>

			<Tabs.Content value="de" class="space-y-4 pt-4">
				<div class="space-y-1.5">
					<Label for="title_de">{m.pages_field_title()}</Label>
					<Input id="title_de" name="title_de" bind:value={titleDe} />
				</div>
				<div class="space-y-1.5">
					<Label for="content_de">{m.pages_field_content()}</Label>
					<textarea
						id="content_de"
						name="content_de"
						rows="12"
						bind:value={contentDe}
						class="w-full rounded-md border bg-transparent px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					></textarea>
				</div>
				<div class="space-y-1.5">
					<Label for="seo_title_de">{m.pages_field_seo_title()}</Label>
					<Input id="seo_title_de" name="seo_title_de" bind:value={seoTitleDe} />
				</div>
				<div class="space-y-1.5">
					<Label for="seo_description_de">{m.pages_field_seo_description()}</Label>
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

		<div class="flex gap-2">
			<Button type="submit" formaction="?/saveDraft" variant="outline">
				{m.pages_save_draft()}
			</Button>
			<Button type="submit" formaction="?/publish">
				{m.pages_publish()}
			</Button>
		</div>
	</form>
</div>
