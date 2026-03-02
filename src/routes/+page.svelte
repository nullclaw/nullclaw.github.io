<svelte:head>
  <title>NullClaw Ecosystem Docs</title>
</svelte:head>

<section class="hero">
  <div class="hero-inner">
    <p class="kicker">NULLCLAW ECOSYSTEM</p>
    <h1>Documentation Hub For Autonomous AI Infrastructure</h1>
    <p class="summary">
      Core runtime in Zig, terminal-first web UI in Svelte, and upcoming
      orchestration products. This portal is structured for fast onboarding and
      deep technical reference.
    </p>

    <div class="hero-actions">
      <a href="/nullclaw/docs/getting-started" class="btn primary"
        >NullClaw Quick Start</a
      >
      <a href="/chat-ui/docs/quick-start" class="btn secondary"
        >Chat UI Quick Start</a
      >
    </div>

    <div class="hero-metrics">
      <article>
        <h3>19</h3>
        <p>top-level CLI commands in core runtime</p>
      </article>
      <article>
        <h3>20</h3>
        <p>channel integrations in `channel_catalog`</p>
      </article>
      <article>
        <h3>89</h3>
        <p>compatible provider aliases in factory</p>
      </article>
      <article>
        <h3>34</h3>
        <p>tool specs declared in source code</p>
      </article>
    </div>
  </div>
</section>

<section class="flow">
  <div class="section-title">System Flow</div>
  <div class="flow-grid">
    <article>
      <h3>1. Runtime</h3>
      <p>
        <a href="/nullclaw">NullClaw</a> handles providers, channels, tools, memory,
        policy and gateway endpoints.
      </p>
    </article>
    <article>
      <h3>2. Client</h3>
      <p>
        <a href="/chat-ui">NullClaw Chat UI</a> pairs via PIN, streams events, renders
        tools, and handles approvals.
      </p>
    </article>
    <article>
      <h3>3. Expansion</h3>
      <p>
        Orchestrator and Task Tracker are listed as roadmap modules and will be
        attached into the same ecosystem docs.
      </p>
    </article>
  </div>
</section>

<section class="projects">
  <div class="section-title">Projects</div>
  <div class="project-grid">
    <article class="project active">
      <div class="top">
        <span class="tag">ACTIVE</span>
        <span class="name">Core</span>
      </div>
      <h3>NullClaw</h3>
      <p>
        Fastest, smallest, and fully autonomous AI assistant infrastructure
        written in Zig.
      </p>
      <ul>
        <li>CLI + gateway + channel runtime</li>
        <li>Capabilities manifest and configurable toolset</li>
        <li>Memory engines, sandboxing, pairing security</li>
      </ul>
      <div class="actions">
        <a href="/nullclaw/docs/getting-started">Docs</a>
        <a href="https://github.com/nullclaw/nullclaw" target="_blank">GitHub</a
        >
      </div>
    </article>

    <article class="project active">
      <div class="top">
        <span class="tag">ACTIVE</span>
        <span class="name">Client</span>
      </div>
      <h3>NullClaw Chat UI</h3>
      <p>
        Svelte-based terminal interface implementing WebChannel v1, E2E
        messaging, and approval UX.
      </p>
      <ul>
        <li>Protocol-typed transport client</li>
        <li>Session restore with token TTL</li>
        <li>Streaming timeline for tool calls</li>
      </ul>
      <div class="actions">
        <a href="/chat-ui/docs/quick-start">Docs</a>
        <a href="https://github.com/nullclaw/nullclaw-chat-ui" target="_blank"
          >GitHub</a
        >
      </div>
    </article>

    <article class="project roadmap">
      <div class="top">
        <span class="tag">IN DEVELOPMENT</span>
        <span class="name">Roadmap</span>
      </div>
      <h3>Task Tracker</h3>
      <p>
        Planned task-level control surface for autonomous execution, tracking,
        and review loops.
      </p>
      <ul>
        <li>Execution queue and state transitions</li>
        <li>Agent-centered issue workflow</li>
        <li>Tight integration with orchestrator</li>
      </ul>
      <div class="actions">
        <a href="/tracker">Roadmap Page</a>
      </div>
    </article>

    <article class="project roadmap">
      <div class="top">
        <span class="tag">IN DEVELOPMENT</span>
        <span class="name">Roadmap</span>
      </div>
      <h3>Orchestrator</h3>
      <p>
        Planned control plane for multi-agent scheduling, delegation,
        coordination, and observability.
      </p>
      <ul>
        <li>Task routing across specialized agents</li>
        <li>Execution policy and safety gates</li>
        <li>Cross-project ecosystem glue</li>
      </ul>
      <div class="actions">
        <a href="/orchestrator">Roadmap Page</a>
      </div>
    </article>
  </div>
</section>

<section class="quickstart">
  <div class="section-title">Ecosystem Quick Start</div>
  <div class="panel">
    <pre><code
        ># 1) Core runtime
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw
zig build -Doptimize=ReleaseSmall
./zig-out/bin/nullclaw onboard --provider openrouter --api-key &lt;API_KEY&gt;
# then add channels.web account in ~/.nullclaw/config.json
./zig-out/bin/nullclaw gateway

# 2) Web UI
cd ../nullclaw-ui
npm install
npm run dev
# open http://localhost:5173
# endpoint: ws://127.0.0.1:32123/ws
# pairing PIN: 123456</code
      ></pre>
  </div>
</section>

<style>
  .hero,
  .flow,
  .projects,
  .quickstart {
    width: min(1180px, 100% - 48px);
    margin: 0 auto;
  }

  .hero {
    padding: 72px 0 52px;
  }

  .hero-inner {
    border: 1px solid var(--border);
    background: radial-gradient(
        circle at 85% 0%,
        color-mix(in srgb, var(--accent) 24%, transparent),
        transparent 40%
      ),
      var(--bg-surface);
    padding: 34px;
    border-radius: 12px;
  }

  .kicker {
    color: var(--accent-dim);
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    margin-bottom: 14px;
  }

  h1 {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 3rem);
    line-height: 1.1;
    max-width: 18ch;
    text-wrap: balance;
  }

  .summary {
    color: var(--fg-dim);
    max-width: 70ch;
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

  .flow {
    margin-top: 10px;
  }

  .flow-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .flow-grid article {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    background: var(--bg-surface);
  }

  .flow-grid h3 {
    margin: 0 0 10px;
  }

  .flow-grid p {
    margin: 0;
    color: var(--fg-dim);
    line-height: 1.6;
  }

  .flow-grid a {
    color: var(--accent);
  }

  .projects {
    margin-top: 28px;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .project {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px;
    background: var(--bg-surface);
    display: grid;
    gap: 10px;
  }

  .project.active {
    background: linear-gradient(
        160deg,
        color-mix(in srgb, var(--accent) 7%, transparent),
        transparent 45%
      ),
      var(--bg-surface);
  }

  .project.roadmap {
    opacity: 0.93;
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
    background: #000;
  }

  pre {
    margin: 0;
    padding: 18px;
    font-size: 0.88rem;
    line-height: 1.5;
  }

  @media (max-width: 1020px) {
    .flow-grid,
    .project-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 700px) {
    .hero,
    .flow,
    .projects,
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
