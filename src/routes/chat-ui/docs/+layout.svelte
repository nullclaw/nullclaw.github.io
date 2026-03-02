<script lang="ts">
  import DocsLayout from "$lib/components/DocsLayout.svelte";
  import { page } from "$app/stores";

  let { children } = $props();

  const sections = [
    {
      title: "Start Here",
      items: [
        { label: "Quick Start", href: "/chat-ui/docs/quick-start" },
        { label: "Overview", href: "/chat-ui/docs/overview" },
        { label: "Architecture", href: "/chat-ui/docs/architecture" },
      ],
    },
    {
      title: "Protocol",
      items: [{ label: "WebChannel v1", href: "/chat-ui/docs/protocol" }],
    },
    {
      title: "Build And Ops",
      items: [
        { label: "Development", href: "/chat-ui/docs/development" },
        { label: "Testing", href: "/chat-ui/docs/testing" },
        { label: "Operations", href: "/chat-ui/docs/operations" },
      ],
    },
    {
      title: "UI",
      items: [{ label: "Theming", href: "/chat-ui/docs/theming" }],
    },
  ];
</script>

<DocsLayout sidebarTitle="Chat UI Docs" {sections} tocContent={$page.data?.content ?? ""}>
  {@render children()}
</DocsLayout>
