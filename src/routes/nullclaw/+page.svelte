<script lang="ts">
    import { onMount } from "svelte";

    let typedText = $state("");
    const fullText =
        "Fastest, smallest, and fully autonomous AI assistant infrastructure written in Zig.";

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
    <title>NullClaw | AI Assistant Infrastructure</title>
</svelte:head>

<div class="header">
    <div class="container">
        <div class="breadcrumb">
            <a href="/">NULLCLAW ECOSYSTEM</a> / NULLCLAW
        </div>
        <h1>NULLCLAW</h1>
        <p class="subtitle">
            <span class="prompt-arrow">&gt; </span>
            {typedText}<span class="cursor">_</span>
        </p>

        <div class="stat-badges">
            <span class="badge">678 KB binary</span>
            <span class="badge">&lt;2ms startup</span>
            <span class="badge">~1MB RAM</span>
            <span class="badge">3,230+ tests</span>
        </div>

        <div class="actions">
            <a href="/nullclaw/docs/getting-started" class="btn primary"
                >Get Started</a
            >
            <a
                href="https://github.com/nullclaw/nullclaw"
                target="_blank"
                class="btn secondary">View on GitHub</a
            >
        </div>
    </div>
</div>

<div class="container">
    <section class="overview">
        <div class="feature-card">
            <div class="icon">[ PROVIDERS ]</div>
            <h3>22+ AI Providers</h3>
            <p>
                Anthropic, OpenAI, Gemini, Ollama, OpenRouter, and more.
                Hot-swappable vtable interfaces with zero lock-in.
            </p>
        </div>

        <div class="feature-card">
            <div class="icon">[ CHANNELS ]</div>
            <h3>19 Messaging Channels</h3>
            <p>
                Telegram, Discord, Slack, Signal, Nostr, Matrix, IRC, WhatsApp,
                Web, and more. All channels run simultaneously.
            </p>
        </div>

        <div class="feature-card">
            <div class="icon">[ MEMORY ]</div>
            <h3>Hybrid Memory System</h3>
            <p>
                SQLite with FTS5 + vector cosine similarity. Multiple backends.
                Adaptive retrieval with RRF and MMR.
            </p>
        </div>

        <div class="feature-card">
            <div class="icon">[ SECURITY ]</div>
            <h3>Multi-Layer Security</h3>
            <p>
                6-digit pairing, ChaCha20-Poly1305 encryption,
                Landlock/Firejail/Bubblewrap sandbox, audit logging.
            </p>
        </div>
    </section>

    <section class="installation">
        <h2>
            <span class="bracket">[</span> QUICK START
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
                    ><span class="comment"># Clone and build</span>
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw && zig build -Doptimize=ReleaseSmall

<span class="comment"># Quick setup</span>
./zig-out/bin/nullclaw onboard --interactive

<span class="comment"># Start the gateway</span>
./zig-out/bin/nullclaw gateway</code
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
        margin-bottom: 30px;
        height: 1.5em;
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

    .stat-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 30px;
    }

    .badge {
        padding: 6px 15px;
        border: 1px solid var(--border);
        border-radius: 20px;
        font-size: 0.85rem;
        letter-spacing: 1px;
        font-weight: bold;
        background: var(--bg-surface);
        color: var(--accent);
        border-color: var(--accent-dim);
        box-shadow: 0 0 10px rgba(0, 255, 65, 0.15);
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

    .btn.secondary {
        background: transparent;
        color: var(--fg-dim);
        border-color: var(--border);
    }

    .btn.secondary:hover {
        color: var(--fg);
        border-color: var(--accent-dim);
        background: var(--bg-hover);
        box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
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
