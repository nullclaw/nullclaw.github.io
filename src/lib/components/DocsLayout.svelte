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
        display: flex;
        max-width: 1400px;
        margin: 0 auto;
        min-height: calc(100vh - 70px - 85px);
    }

    .docs-content {
        flex: 1;
        padding: 40px 60px;
        max-width: 900px;
    }

    /* Global Markdown Styles */
    :global(.markdown-body h1, .markdown-body h2, .markdown-body h3) {
        color: var(--fg);
        margin-top: 40px;
        margin-bottom: 20px;
    }
    :global(.markdown-body h1) {
        font-size: 3rem;
        border-bottom: 1px solid var(--border);
        padding-bottom: 15px;
        margin-bottom: 30px;
        color: var(--accent);
        text-shadow: var(--text-glow);
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    :global(.markdown-body h2) {
        font-size: 2rem;
        border-bottom: 1px dashed var(--border);
        padding-bottom: 10px;
    }
    :global(.markdown-body h3) {
        font-size: 1.5rem;
    }
    :global(.markdown-body p, .markdown-body li) {
        color: var(--fg-dim);
        line-height: 1.7;
        margin-bottom: 15px;
        font-size: 1.05rem;
    }
    :global(.markdown-body a) {
        color: var(--accent);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.3s;
    }
    :global(.markdown-body a:hover) {
        border-bottom-color: var(--accent);
        text-shadow: var(--text-glow);
    }
    :global(.markdown-body ul, .markdown-body ol) {
        margin-bottom: 20px;
        padding-left: 30px;
    }
    :global(.markdown-body code:not(pre code)) {
        background: var(--bg-surface);
        padding: 3px 6px;
        border-radius: 4px;
        border: 1px solid var(--border);
        color: var(--error);
        font-size: 0.9em;
    }
    :global(.markdown-body pre) {
        background: #000;
        border: 1px solid var(--border);
        padding: 20px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 25px 0;
    }
    :global(.markdown-body blockquote) {
        border-left: 4px solid var(--accent);
        background: var(--bg-surface);
        padding: 15px 20px;
        margin: 20px 0;
        font-style: italic;
    }
</style>
