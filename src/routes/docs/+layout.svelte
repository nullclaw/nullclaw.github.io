<script lang="ts">
    import { onMount } from "svelte";

    let { children } = $props();
</script>

<div class="docs-layout">
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="label">[ NULLCLAW DOCS ]</div>
        </div>
        <nav class="sidebar-nav">
            <div class="nav-section">
                <h3>Core</h3>
                <ul>
                    <li>
                        <a href="/docs/getting-started" class="active"
                            >Getting Started</a
                        >
                    </li>
                    <li><a href="/docs/architecture">Architecture</a></li>
                    <li><a href="/docs/configuration">Configuration</a></li>
                </ul>
            </div>

            <div class="nav-section">
                <h3>Components</h3>
                <ul>
                    <li><a href="/docs/providers">Providers</a></li>
                    <li><a href="/docs/channels">Channels</a></li>
                    <li><a href="/docs/tools">Tools</a></li>
                    <li><a href="/docs/cli">CLI</a></li>
                </ul>
            </div>
        </nav>
    </aside>

    <div class="docs-content markdown-body">
        {@render children()}
    </div>
</div>

<style>
    .docs-layout {
        display: flex;
        max-width: 1400px;
        margin: 0 auto;
        min-height: calc(100vh - 70px - 85px); /* Minus navbar and footer */
    }

    .sidebar {
        width: 280px;
        border-right: 1px solid var(--border);
        padding: 30px;
        background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.2));
    }

    .sidebar-header {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px dashed var(--border);
    }

    .sidebar-header .label {
        color: var(--accent);
        font-weight: bold;
        letter-spacing: 2px;
    }

    .nav-section {
        margin-bottom: 30px;
    }

    .nav-section h3 {
        color: var(--fg-dim);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 15px;
    }

    .nav-section ul {
        list-style: none;
        padding: 0;
    }

    .nav-section li {
        margin-bottom: 10px;
    }

    .nav-section a {
        color: var(--fg);
        text-decoration: none;
        display: block;
        padding: 8px 15px;
        border-left: 2px solid transparent;
        transition: all 0.3s ease;
    }

    .nav-section a:hover {
        background: var(--bg-hover);
        color: var(--accent);
        border-left-color: var(--accent-dim);
    }

    .nav-section a.active {
        color: var(--accent);
        border-left-color: var(--accent);
        background: rgba(
            0,
            255,
            65,
            0.05
        ); /* Assuming matrix theme for now, adapts correctly in css */
        text-shadow: var(--text-glow);
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
