<script lang="ts">
  import DocsLayout from "$lib/components/DocsLayout.svelte";
  import { page } from "$app/stores";

  let { children } = $props();

  const sections = [
    {
      title: "Start Here",
      items: [
        { label: "Quick Start", href: "/nullboiler/docs/quick-start" },
        { label: "Overview", href: "/nullboiler/docs/overview" },
        { label: "Architecture", href: "/nullboiler/docs/architecture" },
      ],
    },
    {
      title: "Execution",
      items: [
        { label: "Step Types", href: "/nullboiler/docs/step-types" },
        { label: "Worker Protocols", href: "/nullboiler/docs/worker-protocols" },
      ],
    },
    {
      title: "Reference",
      items: [{ label: "API", href: "/nullboiler/docs/api" }],
    },
    {
      title: "Operate",
      items: [{ label: "Operations", href: "/nullboiler/docs/operations" }],
    },
  ];
</script>

<DocsLayout sidebarTitle="NullBoiler Docs" {sections} tocContent={$page.data?.content ?? ""}>
  {@render children()}
</DocsLayout>
