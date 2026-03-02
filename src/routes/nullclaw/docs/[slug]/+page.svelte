<script lang="ts">
  import { page } from "$app/stores";
  import { renderMarkdown } from "$lib/markdown";

  let { data } = $props();
  let content = $derived(renderMarkdown(data.content));
</script>

<svelte:head>
  <title>NullClaw | {$page.params.slug}</title>
</svelte:head>

<div class="prose">
  {@html content}
</div>
