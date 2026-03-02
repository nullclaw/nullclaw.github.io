<script lang="ts">
  import DocsLayout from "$lib/components/DocsLayout.svelte";
  import { page } from "$app/stores";

  let { children } = $props();

  const sections = [
    {
      title: "Start Here",
      items: [
        { label: "Quick Start", href: "/nullclaw/docs/getting-started" },
        { label: "Overview", href: "/nullclaw/docs/overview" },
        { label: "Architecture", href: "/nullclaw/docs/architecture" },
      ],
    },
    {
      title: "Configuration",
      items: [
        { label: "Configuration", href: "/nullclaw/docs/configuration" },
        { label: "Providers", href: "/nullclaw/docs/providers" },
        { label: "Channels", href: "/nullclaw/docs/channels" },
      ],
    },
    {
      title: "Runtime",
      items: [
        { label: "Tools", href: "/nullclaw/docs/tools" },
        { label: "Memory", href: "/nullclaw/docs/memory" },
        { label: "Security", href: "/nullclaw/docs/security" },
      ],
    },
    {
      title: "Reference",
      items: [{ label: "CLI", href: "/nullclaw/docs/cli" }],
    },
  ];
</script>

<DocsLayout sidebarTitle="NullClaw Docs" {sections} tocContent={$page.data?.content ?? ""}>
  {@render children()}
</DocsLayout>
