<script lang="ts">
  import { page } from '$app/state'
</script>

<div
  class="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center"
>
  <h1 class="mb-4 text-6xl font-bold text-muted-foreground">
    {page.status ?? 500}
  </h1>
  <p class="mb-8 text-lg text-muted-foreground">
    {page.status === 404 ? 'Page not found' : 'Something went wrong'}
  </p>
  <a
    href="/"
    class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
  >
    Go Home
  </a>
</div>
