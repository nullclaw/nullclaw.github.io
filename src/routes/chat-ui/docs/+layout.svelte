<script lang="ts">
  import DocsLayout from "$lib/components/DocsLayout.svelte";
  import { page } from "$app/stores";

  let { children } = $props();

  const sections = [
    {
      title: "Overview",
      items: [
        { label: "Overview", href: "/chat-ui/docs/overview" },
        { label: "Architecture", href: "/chat-ui/docs/architecture" },
      ],
    },
    {
      title: "Protocol",
      items: [
        { label: "WebChannel v1", href: "/chat-ui/docs/protocol" },
      ],
    },
    {
      title: "Development",
      items: [
        { label: "Development", href: "/chat-ui/docs/development" },
        { label: "Deployment", href: "/chat-ui/docs/deployment" },
        { label: "Theming", href: "/chat-ui/docs/theming" },
      ],
    },
  ];
</script>

<DocsLayout sidebarTitle="CHAT UI DOCS" {sections} tocContent={$page.data?.content ?? ""}>
  {@render children()}
</DocsLayout>
