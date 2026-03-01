<script lang="ts">
    import { onMount } from "svelte";

    let typedText = $state("");
    const fullText =
        "The frontend client for System NullClaw. Beautiful, responsive, and fully customizable.";

    onMount(() => {
        let i = 0;
        const interval = setInterval(() => {
            typedText = fullText.slice(0, i);
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    });
</script>

<svelte:head>
    <title>NullClaw Chat UI | Frontend Client</title>
</svelte:head>

<div class="header">
    <div class="container">
        <div class="breadcrumb">
            <a href="/">NULLCLAW ECOSYSTEM</a> / UI CLIENT
        </div>
        <h1>NULLCLAW UI</h1>
        <p class="subtitle">
            <span class="prompt-arrow">&gt; </span>
            {typedText}<span class="cursor">_</span>
        </p>

        <div class="actions">
            <a
                href="https://github.com/nullclaw/nullclaw-chat-ui"
                target="_blank"
                class="btn primary">View on GitHub</a
            >
        </div>
    </div>
</div>

<div class="container">
    <section class="overview">
        <div class="feature-card">
            <div class="icon">[ SVELTE ]</div>
            <h3>Native SvelteKit</h3>
            <p>
                Built with the latest Svelte 5 and SvelteKit for extreme
                performance and tiny bundle sizes. No React bloat.
            </p>
        </div>

        <div class="feature-card">
            <div class="icon">[ THEMES ]</div>
            <h3>Multi-Thematic</h3>
            <p>
                Five pre-built themes: Matrix, Dracula, Synthwave, Amber, and
                Vintage terminal, with CRT effects built-in.
            </p>
        </div>

        <div class="feature-card">
            <div class="icon">[ RENDER ]</div>
            <h3>Rich Markdown</h3>
            <p>
                Full isomorphism DOM purification, syntax highlighting with
                Highlight.js, and animated markdown rendering.
            </p>
        </div>
    </section>

    <section class="installation">
        <h2>
            <span class="bracket">[</span> INITIALIZATION
            <span class="bracket">]</span>
        </h2>

        <div class="code-block">
            <div class="code-header">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
                <span class="title">terminal - ~</span>
            </div>
            <pre><code
                    ><span class="comment"># Clone the repository</span>
git clone https://github.com/nullclaw/nullclaw-chat-ui.git

<span class="comment"># Install dependencies</span>
cd nullclaw-chat-ui
npm install

<span class="comment"># Run development server</span>
npm run dev -- --open</code
                ></pre>
        </div>
    </section>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 40px;
    }

    .header {
        padding: 80px 0 60px;
        border-bottom: 1px solid var(--border);
        margin-bottom: 60px;
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 255, 65, 0.05)
        );
    }

    .breadcrumb {
        color: var(--accent-dim);
        font-weight: bold;
        letter-spacing: 2px;
        margin-bottom: 20px;
        font-size: 0.9rem;
    }

    .breadcrumb a {
        color: inherit;
        text-decoration: none;
        transition: color 0.3s;
    }

    .breadcrumb a:hover {
        color: var(--accent);
        text-shadow: var(--text-glow);
    }

    h1 {
        font-size: 4rem;
        font-weight: 700;
        letter-spacing: 8px;
        margin-bottom: 20px;
        color: var(--fg);
        text-shadow: 0 0 20px var(--accent);
    }

    .subtitle {
        font-size: 1.2rem;
        color: var(--fg-dim);
        margin-bottom: 40px;
        height: 1.5em; /* fixed height */
    }

    .prompt-arrow {
        color: var(--accent);
        font-weight: bold;
    }

    .cursor {
        display: inline-block;
        width: 10px;
        height: 1em;
        background: var(--accent);
        animation: blinkCursor 1s infinite;
        vertical-align: middle;
    }

    .actions {
        display: flex;
        gap: 20px;
    }

    .btn {
        padding: 12px 25px;
        text-decoration: none;
        font-size: 1rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
        border: 1px solid var(--border);
        transition: all 0.3s ease;
        clip-path: polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
        );
    }

    .btn.primary {
        background: transparent;
        color: var(--accent);
        border-color: var(--accent);
    }

    .btn.primary:hover {
        background: var(--bg-hover);
        box-shadow: 0 0 15px var(--border-glow);
        text-shadow: var(--text-glow);
    }

    .overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-bottom: 80px;
    }

    .feature-card {
        background: var(--bg-surface);
        border: 1px solid var(--border);
        padding: 30px;
        transition: all 0.3s ease;
    }

    .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border-color: var(--accent);
    }

    .feature-card .icon {
        font-size: 1.2rem;
        color: var(--accent);
        margin-bottom: 20px;
        font-weight: bold;
        letter-spacing: 1px;
    }

    .feature-card h3 {
        font-size: 1.5rem;
        margin-bottom: 15px;
        color: var(--fg);
    }

    .feature-card p {
        color: var(--fg-dim);
        line-height: 1.6;
    }

    .installation h2 {
        font-size: 2rem;
        color: var(--fg);
        letter-spacing: 5px;
        margin-bottom: 40px;
        text-align: center;
    }

    .installation .bracket {
        color: var(--accent-dim);
    }

    .code-block {
        background: #000;
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 80px;
    }

    .code-header {
        background: var(--bg-surface);
        padding: 10px 15px;
        border-bottom: 1px solid var(--border);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .dot.red {
        background: #ff5f56;
    }
    .dot.yellow {
        background: #ffbd2e;
    }
    .dot.green {
        background: #27c93f;
    }

    .code-header .title {
        margin-left: 10px;
        color: var(--fg-dim);
        font-size: 0.9rem;
    }

    pre {
        padding: 20px;
        overflow-x: auto;
    }

    code {
        font-family: var(--font-mono);
        font-size: 0.95rem;
        line-height: 1.6;
        color: var(--fg);
    }

    .comment {
        color: var(--fg-dim);
        opacity: 0.7;
        display: block;
        margin-top: 10px;
    }

    pre code {
        text-shadow: var(--text-glow);
    }
</style>
