<script lang="ts">
  import DocsLayout from "$lib/components/DocsLayout.svelte";
  import { page } from "$app/stores";

  let { children } = $props();

  const sections = [
    {
      title: "Getting Started",
      items: [
        { label: "Quick Start", href: "/nullclaw/docs/getting-started" },
        { label: "Architecture", href: "/nullclaw/docs/architecture" },
        { label: "Configuration", href: "/nullclaw/docs/configuration" },
      ],
    },
    {
      title: "Components",
      items: [
        { label: "Providers", href: "/nullclaw/docs/providers" },
        { label: "Channels", href: "/nullclaw/docs/channels" },
        { label: "Tools", href: "/nullclaw/docs/tools" },
        { label: "Memory", href: "/nullclaw/docs/memory" },
      ],
    },
    {
      title: "Reference",
      items: [
        { label: "Security", href: "/nullclaw/docs/security" },
        { label: "CLI", href: "/nullclaw/docs/cli" },
      ],
    },
  ];
</script>

<DocsLayout sidebarTitle="NULLCLAW DOCS" {sections} tocContent={$page.data?.content ?? ""}>
  {@render children()}
</DocsLayout>
