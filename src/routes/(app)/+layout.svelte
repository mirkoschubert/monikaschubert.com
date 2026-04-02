<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar'
  import StudioSidebar from '$lib/components/studio/studio-sidebar.svelte'
  import StudioHeader from '$lib/components/studio/studio-header.svelte'
  import type { LayoutData } from './$types'

  let { children, data }: { children: any; data: LayoutData } = $props()
</script>

<Sidebar.Provider>
  <StudioSidebar {data} />
  <Sidebar.Inset>
    <StudioHeader />
    <main class="flex flex-1 flex-col gap-4 p-6">
      {@render children()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
