<svelte:head>
  <title>NullClaw — Autonomous AI Agent Runtime</title>
</svelte:head>

<section class="hero">
  <div class="hero-inner">
    <p class="kicker">NULLCLAW RUNTIME</p>
    <h1>The High-Performance Autonomous AI Agent Runtime</h1>
    <p class="summary">
      Zero-dependency, single-binary execution engine for autonomous AI agents.
      Features integrated providers, tools, memory, and a multi-channel gateway
      — everything you need to run agents locally or deploy them to production.
      Part of the <a href="https://nullhub.io">NullHub ecosystem</a>.
    </p>

    <div class="hero-actions">
      <a href="/nullclaw/docs/getting-started" class="btn primary"
        >Get Started</a
      >
      <a href="https://github.com/nullclaw/nullclaw" class="btn secondary"
        >GitHub</a
      >
    </div>

    <div class="hero-metrics">
      <article>
        <h3>19</h3>
        <p>top-level CLI commands</p>
      </article>
      <article>
        <h3>0</h3>
        <p>external dependencies</p>
      </article>
      <article>
        <h3>Zig</h3>
        <p>single-binary, zero GC</p>
      </article>
      <article>
        <h3>Terminal + Web</h3>
        <p>dual operator surface</p>
      </article>
    </div>
  </div>
</section>

<section class="projects">
  <div class="section-title">Core Capabilities</div>
  <div class="project-grid">
    <article class="project active">
      <div class="top">
        <span class="tag">CORE</span>
        <span class="name">Providers</span>
      </div>
      <h3>Universal Model Multiplexer</h3>
      <p>
        High-throughput model abstraction layer supporting OpenRouter,
        OpenAI-compatible APIs, and custom local or remote endpoints.
      </p>
      <ul>
        <li>Automatic model discovery and selection</li>
        <li>Streaming and non-streaming completions</li>
        <li>Key rotation and rate limit handling</li>
      </ul>
      <div class="actions">
        <a href="/nullclaw/docs/providers">Provider Docs</a>
      </div>
    </article>

    <article class="project active">
      <div class="top">
        <span class="tag">CORE</span>
        <span class="name">Tools</span>
      </div>
      <h3>Tool Execution Engine</h3>
      <p>
        Securely execute shell commands, file operations, and custom scripts
        with robust approval policies and strict sandboxing constraints.
      </p>
      <ul>
        <li>Built-in file, shell, and search tools</li>
        <li>Configurable auto-approve and deny lists</li>
        <li>Execution timeout and resource controls</li>
      </ul>
      <div class="actions">
        <a href="/nullclaw/docs/tools">Tools Docs</a>
      </div>
    </article>

    <article class="project active">
      <div class="top">
        <span class="tag">CORE</span>
        <span class="name">Channels</span>
      </div>
      <h3>Communication Channels</h3>
      <p>
        Terminal, WebSocket, and headless gateway modes for seamless integration
        into any operational context or external infrastructure.
      </p>
      <ul>
        <li>Terminal mode for local interactive sessions</li>
        <li>WebChannel v1 protocol for browser clients</li>
        <li>Gateway mode for headless worker execution</li>
      </ul>
      <div class="actions">
        <a href="/nullclaw/docs/channels">Channels Docs</a>
      </div>
    </article>

    <article class="project active">
      <div class="top">
        <span class="tag">CORE</span>
        <span class="name">Memory</span>
      </div>
      <h3>Context & Memory</h3>
      <p>
        Advanced conversation history, state persistence, and automatic context
        window optimization for long-running, multi-turn agent threads.
      </p>
      <ul>
        <li>Auto-compacting context windows</li>
        <li>Session save/restore across restarts</li>
        <li>Structured memory for tool outputs</li>
      </ul>
      <div class="actions">
        <a href="/nullclaw/docs/memory">Memory Docs</a>
      </div>
    </article>
  </div>
</section>

<section class="scenarios">
  <div class="section-title">When To Use NullClaw</div>
  <div class="scenario-grid">
    <article>
      <h3>Interactive Agent Sessions</h3>
      <p class="lead">
        Ideal for single-agent workflows where a dedicated assistant handles
        complex, multi-step tasks end-to-end.
      </p>
      <p>
        Launch NullClaw in terminal mode to refactor code, execute tests, and
        open PRs interactively with human-in-the-loop oversight.
      </p>
    </article>
    <article>
      <h3>Headless Worker Execution</h3>
      <p class="lead">
        Ideal for automated background pipelines where agents execute
        autonomously without human supervision.
      </p>
      <p>
        Deploy NullClaw in gateway mode and dispatch automated task assignments
        directly from an orchestrator like
        <a href="https://nullhub.io/nullboiler/docs/quick-start">NullBoiler</a>.
      </p>
    </article>
    <article>
      <h3>Browser-Based Operation</h3>
      <p class="lead">
        Ideal for teams requiring a comprehensive visual operator dashboard.
      </p>
      <p>
        Pair NullClaw with the
        <a href="https://nullhub.io/chat-ui/docs/quick-start"
          >NullHub Ecosystem</a
        >
        for real-time streaming, tool execution timelines, and visual human-in-the-loop
        approvals.
      </p>
    </article>
  </div>
</section>

<section class="quickstart">
  <div class="section-title">Quick Start</div>
  <div class="panel">
    <pre><code
        ># Clone and build
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw
zig build -Doptimize=ReleaseSmall

# Onboard a provider
./zig-out/bin/nullclaw onboard --provider openrouter --api-key &lt;YOUR_KEY&gt;

# Start an interactive agent session
./zig-out/bin/nullclaw agent -m "hello from nullclaw"

# Or use NullHub to install everything at once:
# https://nullhub.io</code
      ></pre>
  </div>
</section>

<style>
  .hero,
  .projects,
  .scenarios,
  .quickstart {
    width: min(1180px, 100% - 48px);
    margin: 0 auto;
  }

  .hero {
    padding: 72px 0 52px;
  }

  .hero-inner {
    position: relative;
    border: 1px solid var(--border);
    background: radial-gradient(
        circle at 85% 0%,
        color-mix(in srgb, var(--accent) 15%, transparent),
        transparent 45%
      ),
      var(--bg-surface);
    padding: 40px;
    border-radius: 16px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    overflow: hidden;
  }

  .hero-inner::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent,
      rgba(255, 255, 255, 0.02) 40%,
      transparent
    );
    pointer-events: none;
  }

  .kicker {
    color: var(--accent-dim);
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    margin-bottom: 14px;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 4.5vw, 3.5rem);
    line-height: 1.1;
    max-width: 18ch;
    text-wrap: balance;
    background: linear-gradient(180deg, var(--fg) 0%, var(--fg-dim) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  .summary {
    color: var(--fg-dim);
    max-width: 76ch;
    margin: 16px 0 0;
    line-height: 1.7;
  }

  .hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin: 24px 0 26px;
  }

  .btn {
    text-decoration: none;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid var(--border);
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .btn.primary {
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: var(--fg);
  }

  .btn.secondary {
    color: var(--accent);
  }

  .btn:hover {
    border-color: var(--accent);
    box-shadow: 0 0 12px var(--border-glow);
  }

  .hero-metrics {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .hero-metrics article {
    border: 1px dashed var(--border);
    border-radius: 10px;
    padding: 14px;
    background: color-mix(in srgb, var(--bg) 70%, transparent);
  }

  .hero-metrics h3 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--accent);
  }

  .hero-metrics p {
    margin: 8px 0 0;
    color: var(--fg-dim);
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .section-title {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--accent-dim);
    margin-bottom: 16px;
  }

  .projects {
    margin-top: 28px;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .project,
  .scenario-grid article {
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px;
    background: var(--bg-surface);
    display: grid;
    gap: 12px;
    backdrop-filter: blur(12px);
    transition:
      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.3s ease,
      border-color 0.3s ease;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .project.active {
    background: linear-gradient(
        160deg,
        color-mix(in srgb, var(--accent) 5%, transparent),
        transparent 50%
      ),
      var(--bg-surface);
  }

  .project:hover,
  .scenario-grid article:hover {
    transform: translateY(-4px);
    border-color: var(--accent);
    box-shadow:
      0 12px 32px rgba(0, 0, 0, 0.5),
      0 0 16px var(--border-glow),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .tag {
    font-size: 0.7rem;
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 999px;
    letter-spacing: 0.08em;
  }

  .name {
    color: var(--fg-dim);
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  .project h3 {
    margin: 0;
    font-size: 1.35rem;
  }

  .project p {
    margin: 0;
    color: var(--fg-dim);
    line-height: 1.6;
  }

  .project ul {
    margin: 0;
    padding-left: 18px;
    color: var(--fg-dim);
    display: grid;
    gap: 6px;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .actions a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dashed var(--accent-dim);
    font-size: 0.9rem;
  }

  .actions a:hover {
    border-bottom-style: solid;
  }

  .quickstart {
    margin: 30px auto 56px;
  }

  .panel {
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: auto;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    box-shadow:
      inset 0 0 20px rgba(0, 0, 0, 0.8),
      0 4px 12px rgba(0, 0, 0, 0.3);
  }

  pre {
    margin: 0;
    padding: 24px;
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--fg);
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 1100px) {
    .project-grid,
    .scenario-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 700px) {
    .hero,
    .projects,
    .scenarios,
    .quickstart {
      width: min(1180px, 100% - 26px);
    }

    .hero {
      padding: 30px 0 40px;
    }

    .hero-inner {
      padding: 24px 18px;
    }

    h1 {
      font-size: 1.6rem;
    }

    .hero-actions {
      justify-content: stretch;
    }

    .hero-actions .btn {
      width: 100%;
      text-align: center;
    }

    .hero-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
