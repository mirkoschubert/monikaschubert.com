<script lang="ts">
  import { enhance } from '$app/forms'
  import * as m from '$lib/paraglide/messages.js'
  import * as Tabs from '$lib/components/ui/tabs'
  import * as Card from '$lib/components/ui/card'
  import * as Select from '$lib/components/ui/select'
  import * as Popover from '$lib/components/ui/popover'
  import Calendar from '$lib/components/ui/calendar/calendar.svelte'
  import { Input } from '$lib/components/ui/input'
  import { Button } from '$lib/components/ui/button'
  import { Label } from '$lib/components/ui/label'
  import { Badge } from '$lib/components/ui/badge'
  import { ChevronLeft, CalendarIcon } from '@lucide/svelte'
  import { untrack } from 'svelte'
  import { CalendarDate } from '@internationalized/date'
  import MarkdownEditor from '$lib/components/studio/markdown-editor.svelte'
  import type { PageData, ActionData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()

  const isNew = $derived(data.exhibition === null)
  let titleEn = $state(untrack(() => data.exhibition?.title?.en ?? ''))
  let titleDe = $state(untrack(() => data.exhibition?.title?.de ?? ''))
  let descEn = $state(untrack(() => data.exhibition?.description?.en ?? ''))
  let descDe = $state(untrack(() => data.exhibition?.description?.de ?? ''))
  let type = $state(untrack(() => data.exhibition?.type ?? 'exhibition'))
  let locationEn = $state(untrack(() => data.exhibition?.location?.en ?? ''))
  let locationDe = $state(untrack(() => data.exhibition?.location?.de ?? ''))
  let dateFromStr = $state(
    untrack(() => {
      const d = data.exhibition?.dateFrom
      return d ? new Date(d).toISOString().split('T')[0] : ''
    })
  )
  let dateToStr = $state(
    untrack(() => {
      const d = data.exhibition?.dateTo
      return d ? new Date(d).toISOString().split('T')[0] : ''
    })
  )

  let dateFromOpen = $state(false)
  let dateToOpen = $state(false)
  let dateFromCal = $state<CalendarDate | undefined>(
    untrack(() => {
      if (!dateFromStr) return undefined
      return new CalendarDate(
        Number(dateFromStr.slice(0, 4)),
        Number(dateFromStr.slice(5, 7)),
        Number(dateFromStr.slice(8, 10))
      )
    })
  )
  let dateToCal = $state<CalendarDate | undefined>(
    untrack(() => {
      if (!dateToStr) return undefined
      return new CalendarDate(
        Number(dateToStr.slice(0, 4)),
        Number(dateToStr.slice(5, 7)),
        Number(dateToStr.slice(8, 10))
      )
    })
  )

  function calToStr(d: CalendarDate | undefined): string {
    if (!d) return ''
    return d.toString()
  }

  function strToCal(s: string): CalendarDate | undefined {
    if (s.length !== 10) return undefined
    const y = Number(s.slice(0, 4))
    const mo = Number(s.slice(5, 7))
    const d = Number(s.slice(8, 10))
    if (!y || !mo || !d) return undefined
    try {
      return new CalendarDate(y, mo, d)
    } catch {
      return undefined
    }
  }

  const typeOptions = [
    { value: 'vernissage', label: m.exhibition_type_vernissage() },
    { value: 'solo', label: m.exhibition_type_solo() },
    { value: 'double', label: m.exhibition_type_double() },
    { value: 'group', label: m.exhibition_type_group() },
    { value: 'participation', label: m.exhibition_type_participation() },
    { value: 'exhibition', label: m.exhibition_type_exhibition() }
  ]

  const errorMessage = $derived(() => {
    if (!form?.error) return null
    if (form.error === 'title_required')
      return m.exhibition_error_title_required()
    if (form.error === 'location_required')
      return m.exhibition_error_location_required()
    if (form.error === 'date_required')
      return m.exhibition_error_date_required()
    return null
  })
</script>

<div class="space-y-4">
  <div class="flex items-center gap-4">
    <Button variant="ghost" size="sm" href="/studio/exhibitions">
      <ChevronLeft class="mr-1 size-4" />
      {m.exhibition_back()}
    </Button>
    <h1 class="text-2xl font-semibold">
      {isNew ? m.exhibition_new() : m.exhibition_edit()}
    </h1>
  </div>

  {#if form?.success}
    <p class="text-sm text-green-500">{m.exhibition_saved()}</p>
  {/if}
  {#if errorMessage()}
    <p class="text-sm text-destructive">{errorMessage()}</p>
  {/if}

  <form
    method="POST"
    use:enhance={() => {
      return async ({ update, result }) => {
        await update()
        if (result.type === 'success' && result.data?.success) {
          titleEn = data.exhibition?.title?.en ?? ''
          titleDe = data.exhibition?.title?.de ?? ''
          descEn = data.exhibition?.description?.en ?? ''
          descDe = data.exhibition?.description?.de ?? ''
          type = data.exhibition?.type ?? 'exhibition'
          locationEn = data.exhibition?.location?.en ?? ''
          locationDe = data.exhibition?.location?.de ?? ''
          dateFromStr = data.exhibition?.dateFrom
            ? new Date(data.exhibition.dateFrom).toISOString().split('T')[0]
            : ''
          dateToStr = data.exhibition?.dateTo
            ? new Date(data.exhibition.dateTo).toISOString().split('T')[0]
            : ''
        }
      }
    }}
  >
    <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
      <!-- Left column: title + description -->
      <div class="min-w-0 flex-1 space-y-4">
        <Tabs.Root value="en">
          <Tabs.List>
            <Tabs.Trigger value="en">{m.pages_tab_en()}</Tabs.Trigger>
            <Tabs.Trigger value="de">{m.pages_tab_de()}</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="en" class="space-y-4 pt-4">
            <div class="space-y-1.5">
              <Label for="title_en">{m.exhibition_title()}</Label>
              <Input id="title_en" name="title_en" bind:value={titleEn} />
            </div>
            <div class="space-y-1.5">
              <Label for="location_en">{m.exhibition_location()}</Label>
              <Input
                id="location_en"
                name="location_en"
                bind:value={locationEn}
              />
            </div>
            <div class="space-y-1.5">
              <Label>{m.exhibition_field_description()}</Label>
              <MarkdownEditor
                name="description_en"
                bind:value={descEn}
                rows={15}
              />
            </div>
          </Tabs.Content>

          <Tabs.Content value="de" class="space-y-4 pt-4">
            <div class="space-y-1.5">
              <Label for="title_de">{m.exhibition_title()}</Label>
              <Input id="title_de" name="title_de" bind:value={titleDe} />
            </div>
            <div class="space-y-1.5">
              <Label for="location_de">{m.exhibition_location()}</Label>
              <Input
                id="location_de"
                name="location_de"
                bind:value={locationDe}
              />
            </div>
            <div class="space-y-1.5">
              <Label>{m.exhibition_field_description()}</Label>
              <MarkdownEditor
                name="description_de"
                bind:value={descDe}
                rows={15}
              />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <!-- Right column: sidebar cards -->
      <div class="w-full space-y-4 lg:w-72 lg:shrink-0">
        <!-- Card 1: Publish + Status -->
        <Card.Root>
          <Card.Header class="pb-3">
            <Card.Title class="text-sm font-medium"
              >{m.exhibition_card_publish()}</Card.Title
            >
          </Card.Header>
          <Card.Content class="space-y-4">
            <div class="flex flex-col gap-2">
              {#if data.exhibition?.status === 'published'}
                <Button type="submit" formaction="?/publish" class="w-full">
                  {m.exhibition_update()}
                </Button>
                <Button
                  type="submit"
                  formaction="?/saveDraft"
                  variant="outline"
                  class="w-full"
                >
                  {m.exhibition_back_to_draft()}
                </Button>
              {:else}
                <Button type="submit" formaction="?/publish" class="w-full">
                  {m.exhibition_publish()}
                </Button>
                <Button
                  type="submit"
                  formaction="?/saveDraft"
                  variant="outline"
                  class="w-full"
                >
                  {m.exhibition_save_draft()}
                </Button>
              {/if}
            </div>
            <div class="border-t border-border pt-3">
              <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground"
                  >{m.exhibition_status()}:</span
                >
                {#if data.exhibition?.status === 'published'}
                  <Badge>{m.exhibition_status_published()}</Badge>
                {:else}
                  <Badge variant="outline">{m.exhibition_status_draft()}</Badge>
                {/if}
              </div>
            </div>
          </Card.Content>
        </Card.Root>

        <!-- Card 2: Details (type, dates) -->
        <Card.Root>
          <Card.Header class="pb-3">
            <Card.Title class="text-sm font-medium">Details</Card.Title>
          </Card.Header>
          <Card.Content class="space-y-4">
            <div class="space-y-1.5">
              <Label for="type">{m.exhibition_type()}</Label>
              <Select.Root type="single" bind:value={type}>
                <Select.Trigger id="type" class="w-full">
                  {typeOptions.find((o) => o.value === type)?.label ?? type}
                </Select.Trigger>
                <Select.Content>
                  {#each typeOptions as opt (opt.value)}
                    <Select.Item value={opt.value} label={opt.label} />
                  {/each}
                </Select.Content>
              </Select.Root>
              <input type="hidden" name="type" value={type} />
            </div>

            <div class="space-y-1.5">
              <Label for="date_from">{m.exhibition_date_from()}</Label>
              <div class="flex gap-2">
                <Input
                  id="date_from"
                  name="date_from"
                  placeholder="YYYY-MM-DD"
                  bind:value={dateFromStr}
                  oninput={() => {
                    dateFromCal = strToCal(dateFromStr)
                  }}
                />
                <Popover.Root bind:open={dateFromOpen}>
                  <Popover.Trigger>
                    {#snippet child({ props })}
                      <Button variant="outline" size="icon" {...props}>
                        <CalendarIcon class="size-4" />
                      </Button>
                    {/snippet}
                  </Popover.Trigger>
                  <Popover.Content class="w-auto p-0" align="end">
                    <Calendar
                      type="single"
                      bind:value={dateFromCal}
                      onValueChange={() => {
                        dateFromStr = calToStr(dateFromCal)
                        dateFromOpen = false
                      }}
                    />
                  </Popover.Content>
                </Popover.Root>
              </div>
            </div>

            <div class="space-y-1.5">
              <Label for="date_to">{m.exhibition_date_to()}</Label>
              <div class="flex gap-2">
                <Input
                  id="date_to"
                  name="date_to"
                  placeholder="YYYY-MM-DD"
                  bind:value={dateToStr}
                  oninput={() => {
                    dateToCal = strToCal(dateToStr)
                  }}
                />
                <Popover.Root bind:open={dateToOpen}>
                  <Popover.Trigger>
                    {#snippet child({ props })}
                      <Button variant="outline" size="icon" {...props}>
                        <CalendarIcon class="size-4" />
                      </Button>
                    {/snippet}
                  </Popover.Trigger>
                  <Popover.Content class="w-auto p-0" align="end">
                    <Calendar
                      type="single"
                      bind:value={dateToCal}
                      onValueChange={() => {
                        dateToStr = calToStr(dateToCal)
                        dateToOpen = false
                      }}
                    />
                  </Popover.Content>
                </Popover.Root>
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  </form>
</div>
