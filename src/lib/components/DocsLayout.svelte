<script lang="ts">
  import type { Snippet } from "svelte";
  import DocSidebar from "./DocSidebar.svelte";
  import TableOfContents from "./TableOfContents.svelte";

  interface SidebarItem {
    label: string;
    href: string;
  }

  interface SidebarSection {
    title: string;
    items: SidebarItem[];
  }

  let {
    sidebarTitle,
    sections,
    tocContent = "",
    children,
  }: {
    sidebarTitle: string;
    sections: SidebarSection[];
    tocContent?: string;
    children: Snippet;
  } = $props();
</script>

<div class="docs-layout">
  <DocSidebar title={sidebarTitle} {sections} />

  <div class="docs-content markdown-body">
    {@render children()}
  </div>

  {#if tocContent}
    <TableOfContents content={tocContent} />
  {/if}
</div>

<style>
  .docs-layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr) 250px;
    max-width: 1440px;
    margin: 0 auto;
    min-height: calc(100vh - 70px - 132px);
  }

  .docs-content {
    width: 100%;
    max-width: 900px;
    padding: 34px 42px 56px;
  }

  :global(
      .markdown-body h1,
      .markdown-body h2,
      .markdown-body h3,
      .markdown-body h4
    ) {
    color: var(--fg);
    line-height: 1.24;
  }

  :global(.markdown-body h1) {
    font-size: clamp(1.7rem, 3vw, 2.35rem);
    border-bottom: 1px solid var(--border);
    padding-bottom: 12px;
    margin: 4px 0 22px;
  }

  :global(.markdown-body h2) {
    font-size: clamp(1.25rem, 2.4vw, 1.75rem);
    margin: 34px 0 14px;
    border-bottom: 1px dashed var(--border);
    padding-bottom: 8px;
  }

  :global(.markdown-body h3) {
    font-size: clamp(1.05rem, 2vw, 1.25rem);
    margin: 26px 0 10px;
  }

  :global(.markdown-body p, .markdown-body li) {
    color: var(--fg-dim);
    line-height: 1.75;
    margin: 0 0 12px;
    font-size: 0.98rem;
  }

  :global(.markdown-body a) {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dashed transparent;
    transition: border-color 0.2s ease;
  }

  :global(.markdown-body a:hover) {
    border-bottom-color: var(--accent);
  }

  :global(.markdown-body ul, .markdown-body ol) {
    margin: 10px 0 16px;
    padding-left: 24px;
  }

  :global(.markdown-body li + li) {
    margin-top: 4px;
  }

  :global(.markdown-body code:not(pre code)) {
    background: color-mix(in srgb, var(--bg) 65%, transparent);
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid var(--border);
    color: var(--accent);
    font-size: 0.9em;
  }

  :global(.markdown-body pre) {
    background: #000;
    border: 1px solid var(--border);
    padding: 15px;
    border-radius: 10px;
    overflow-x: auto;
    margin: 16px 0 20px;
    max-width: 100%;
    box-sizing: border-box;
  }

  :global(.markdown-body blockquote) {
    border-left: 3px solid var(--accent);
    background: color-mix(in srgb, var(--bg) 74%, transparent);
    padding: 12px 14px;
    margin: 16px 0;
  }

  :global(.markdown-body table) {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 20px;
    border: 1px solid var(--border);
    display: block;
    overflow-x: auto;
  }

  :global(.markdown-body th, .markdown-body td) {
    border: 1px solid var(--border);
    padding: 8px 10px;
    text-align: left;
    vertical-align: top;
  }

  :global(.markdown-body th) {
    color: var(--fg);
    background: color-mix(in srgb, var(--bg) 80%, transparent);
    font-weight: 700;
  }

  :global(.markdown-body hr) {
    border: 0;
    border-top: 1px dashed var(--border);
    margin: 22px 0;
  }

  @media (max-width: 1200px) {
    .docs-layout {
      grid-template-columns: 260px minmax(0, 1fr);
    }
  }

  @media (max-width: 980px) {
    .docs-layout {
      display: flex;
      flex-direction: column;
    }

    .docs-content {
      max-width: 100%;
      padding: 24px 18px 56px;
      box-sizing: border-box;
      overflow-x: hidden;
    }

    :global(.markdown-body h1) {
      font-size: 1.85rem;
    }
  }
</style>
