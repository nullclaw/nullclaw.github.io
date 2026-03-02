<script lang="ts">
  import DocsLayout from "$lib/components/DocsLayout.svelte";
  import { page } from "$app/stores";

  let { children } = $props();

  const sections = [
    {
      title: "Start Here",
      items: [
        { label: "Quick Start", href: "/nulltickets/docs/quick-start" },
        { label: "Overview", href: "/nulltickets/docs/overview" },
        { label: "Architecture", href: "/nulltickets/docs/architecture" },
      ],
    },
    {
      title: "Execution",
      items: [
        { label: "Pipeline Model", href: "/nulltickets/docs/pipeline-model" },
      ],
    },
    {
      title: "Reference",
      items: [{ label: "API", href: "/nulltickets/docs/api" }],
    },
    {
      title: "Operate",
      items: [{ label: "Operations", href: "/nulltickets/docs/operations" }],
    },
  ];
</script>

<DocsLayout sidebarTitle="NullTickets Docs" {sections} tocContent={$page.data?.content ?? ""}>
  {@render children()}
</DocsLayout>
