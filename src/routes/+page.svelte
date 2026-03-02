<script lang="ts">
    import { onMount } from "svelte";

    let typedText = $state("");
    const fullText =
        "The ultimate ecosystem for fully autonomous, zero-overhead AI infrastructure.";

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

<div class="hero">
    <div class="hero-content">
        <h1 class="glitch-text" data-text="NULLCLAW ECOSYSTEM">
            NULLCLAW ECOSYSTEM
        </h1>
        <p class="subtitle">
            <span class="prompt-arrow">&gt; </span>
            {typedText}<span class="cursor">_</span>
        </p>
        <div class="tech-stack">
            <span class="badge zig">Powered by Zig</span>
            <span class="badge svelte">Interfaces in Svelte</span>
        </div>
    </div>
</div>

<section class="projects">
    <div class="section-title">
        <h2>
            <span class="bracket">[</span> ACTIVE PROJECTS
            <span class="bracket">]</span>
        </h2>
    </div>

    <div class="project-grid">
        <!-- NullClaw Core Desktop/CLI Agent -->
        <a href="/nullclaw" class="project-card core">
            <div class="card-header">
                <div class="icon">[ CORE ]</div>
                <div class="status online">ONLINE</div>
            </div>
            <h3>NullClaw Agent</h3>
            <p>
                Fastest, smallest, and fully autonomous AI assistant
                infrastructure written in Zig. Zero overhead, absolute
                portability.
            </p>
            <div class="card-footer">
                <span class="link-text">Initialize System &rarr;</span>
            </div>
        </a>

        <!-- NullClaw UI -->
        <a href="/chat-ui" class="project-card client">
            <div class="card-header">
                <div class="icon">[ UI ]</div>
                <div class="status online">ONLINE</div>
            </div>
            <h3>NullClaw Chat UI</h3>
            <p>
                Sleek, responsive Svelte frontend for NullClaw. Multiple premium
                CRT themes, rich code rendering, and seamless agent interaction.
            </p>
            <div class="card-footer">
                <span class="link-text">View Client &rarr;</span>
            </div>
        </a>

        <!-- Upcoming: Orchestrator -->
        <div class="project-card upcoming">
            <div class="card-header">
                <div class="icon">[ ORCH ]</div>
                <div class="status offline">IN DEV</div>
            </div>
            <h3>Agent Orchestrator</h3>
            <p>
                Multi-agent coordination and distribution system for complex
                distributed reasoning.
            </p>
            <div class="card-footer">
                <span class="link-text">Classified // Access Denied</span>
            </div>
        </div>

        <!-- Upcoming: Task Tracker -->
        <div class="project-card upcoming">
            <div class="card-header">
                <div class="icon">[ TASK ]</div>
                <div class="status offline">IN DEV</div>
            </div>
            <h3>AI Task Tracker</h3>
            <p>
                Autonomous issue resolution and board management interface
                engineered for AI agents.
            </p>
            <div class="card-footer">
                <span class="link-text">Classified // Access Denied</span>
            </div>
        </div>
    </div>
</section>

<style>
    .hero {
        min-height: 50vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 60px 40px 0;
        position: relative;
        overflow: hidden;
    }

    .hero::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        height: 600px;
        background: radial-gradient(
            circle,
            var(--border-glow) 0%,
            transparent 60%
        );
        opacity: 0.15;
        z-index: -1;
        filter: blur(40px);
    }

    .hero-content {
        text-align: center;
        max-width: 900px;
        z-index: 1;
    }

    h1 {
        font-size: 4rem;
        font-weight: 700;
        letter-spacing: 10px;
        margin-bottom: 20px;
        color: var(--fg);
        text-shadow: 0 0 20px var(--accent);
        text-transform: uppercase;
    }

    .subtitle {
        font-size: 1.3rem;
        color: var(--fg-dim);
        margin-bottom: 30px;
        height: 2em; /* fixed height */
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
    }

    .prompt-arrow {
        color: var(--accent);
        font-weight: bold;
    }

    .cursor {
        display: inline-block;
        width: 12px;
        height: 1.2em;
        background: var(--accent);
        animation: blinkCursor 1s infinite;
        vertical-align: middle;
    }

    .tech-stack {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
    }

    .badge {
        padding: 6px 15px;
        border: 1px solid var(--border);
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        background: var(--bg-surface);
    }

    .badge.zig {
        color: #f7a41d;
        border-color: rgba(247, 164, 29, 0.4);
        box-shadow: 0 0 10px rgba(247, 164, 29, 0.2);
    }

    .badge.svelte {
        color: #ff3e00;
        border-color: rgba(255, 62, 0, 0.4);
        box-shadow: 0 0 10px rgba(255, 62, 0, 0.2);
    }

    .projects {
        padding: 60px 40px;
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
    }

    .section-title {
        text-align: center;
        margin-bottom: 50px;
    }

    .section-title h2 {
        font-size: 2rem;
        color: var(--fg);
        letter-spacing: 5px;
    }

    .section-title .bracket {
        color: var(--accent-dim);
    }

    .project-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
    }

    .project-card {
        background: var(--bg-surface);
        border: 1px solid var(--border);
        padding: 30px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        height: 100%;
        clip-path: polygon(
            20px 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            0 100%,
            0 20px
        );
    }

    .project-card:not(.upcoming):hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border-color: var(--accent);
        background: var(--bg-hover);
    }

    .project-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: var(--accent-dim);
        transition: height 0.3s ease;
    }

    .project-card:not(.upcoming):hover::before {
        background: var(--accent);
        box-shadow: 0 0 15px var(--accent);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
    }

    .project-card .icon {
        font-size: 1.2rem;
        color: var(--accent);
        font-weight: bold;
        letter-spacing: 2px;
    }

    .status {
        font-size: 0.8rem;
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: bold;
        letter-spacing: 1px;
    }

    .status.online {
        background: rgba(0, 255, 65, 0.1);
        color: #00ff41;
        border: 1px solid rgba(0, 255, 65, 0.3);
        animation: pulse 2s infinite;
    }

    .status.offline {
        background: rgba(255, 170, 0, 0.1);
        color: var(--warning);
        border: 1px solid rgba(255, 170, 0, 0.3);
    }

    .project-card h3 {
        font-size: 1.8rem;
        margin-bottom: 15px;
        color: var(--fg);
        transition: color 0.3s ease;
    }

    .project-card:not(.upcoming):hover h3 {
        text-shadow: var(--text-glow);
    }

    .project-card p {
        color: var(--fg-dim);
        line-height: 1.6;
        margin-bottom: 30px;
        flex-grow: 1;
    }

    .card-footer {
        border-top: 1px dashed var(--border);
        padding-top: 20px;
        font-size: 0.9rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .project-card.core .card-footer {
        color: var(--accent);
    }
    .project-card.client .card-footer {
        color: var(--accent);
    }

    .project-card.upcoming {
        opacity: 0.6;
        border-color: rgba(255, 255, 255, 0.1);
        cursor: not-allowed;
    }

    .project-card.upcoming::before {
        background: var(--warning);
        opacity: 0.5;
    }

    .project-card.upcoming .card-footer {
        color: var(--warning);
    }

    .link-text {
        transition: padding-left 0.3s ease;
    }

    .project-card:not(.upcoming):hover .link-text {
        padding-left: 10px;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(0, 255, 65, 0.4);
        }
        70% {
            box-shadow: 0 0 0 5px rgba(0, 255, 65, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(0, 255, 65, 0);
        }
    }

    /* Glitch Effect */
    .glitch-text {
        position: relative;
    }

    .glitch-text::before,
    .glitch-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        pointer-events: none;
    }

    .glitch-text::before {
        left: 2px;
        text-shadow: -2px 0 var(--error);
        clip: rect(24px, 550px, 90px, 0);
        animation: glitch-anim 3s infinite linear alternate-reverse;
    }

    .glitch-text::after {
        left: -2px;
        text-shadow: -2px 0 var(--accent);
        clip: rect(85px, 550px, 140px, 0);
        animation: glitch-anim 2.5s infinite linear alternate-reverse;
    }

    @keyframes glitch-anim {
        0% {
            clip: rect(70px, 9999px, 71px, 0);
        }
        5% {
            clip: rect(29px, 9999px, 83px, 0);
        }
        10% {
            clip: rect(65px, 9999px, 49px, 0);
        }
        15% {
            clip: rect(20px, 9999px, 18px, 0);
        }
        20% {
            clip: rect(61px, 9999px, 53px, 0);
        }
        25% {
            clip: rect(32px, 9999px, 81px, 0);
        }
        30% {
            clip: rect(98px, 9999px, 66px, 0);
        }
        35% {
            clip: rect(11px, 9999px, 34px, 0);
        }
        40% {
            clip: rect(14px, 9999px, 5px, 0);
        }
        45% {
            clip: rect(1px, 9999px, 20px, 0);
        }
        50% {
            clip: rect(4px, 9999px, 8px, 0);
        }
        55% {
            clip: rect(25px, 9999px, 74px, 0);
        }
        60% {
            clip: rect(9px, 9999px, 10px, 0);
        }
        65% {
            clip: rect(33px, 9999px, 80px, 0);
        }
        70% {
            clip: rect(10px, 9999px, 4px, 0);
        }
        75% {
            clip: rect(8px, 9999px, 91px, 0);
        }
        80% {
            clip: rect(66px, 9999px, 43px, 0);
        }
        85% {
            clip: rect(3px, 9999px, 22px, 0);
        }
        90% {
            clip: rect(87px, 9999px, 58px, 0);
        }
        95% {
            clip: rect(20px, 9999px, 3px, 0);
        }
        100% {
            clip: rect(40px, 9999px, 10px, 0);
        }
    }
</style>
