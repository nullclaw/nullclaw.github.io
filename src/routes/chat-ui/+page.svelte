<svelte:head>
  <title>NullClaw Chat UI Documentation</title>
</svelte:head>

<div class="wrap">
  <section class="hero">
    <div class="breadcrumb"><a href="/">Ecosystem</a> / Chat UI</div>
    <h1>NullClaw Chat UI</h1>
    <p>
      Terminal-style web client for NullClaw with pairing, E2E bootstrap, streamed assistant output,
      tool timeline rendering, and approval flow.
    </p>

    <div class="actions">
      <a href="/chat-ui/docs/quick-start" class="btn primary">Quick Start</a>
      <a href="/chat-ui/docs/protocol" class="btn secondary">Protocol</a>
      <a href="https://github.com/nullclaw/nullclaw-chat-ui" target="_blank" class="btn secondary">GitHub</a>
    </div>

    <div class="metrics">
      <article><h3>10</h3><p>WebChannel event types in `types.ts`</p></article>
      <article><h3>5</h3><p>client states in `NullclawClient`</p></article>
      <article><h3>10</h3><p>test suites in `src/lib/*/*.test.ts`</p></article>
      <article><h3>3</h3><p>localStorage keys for auth/theme/effects</p></article>
    </div>
  </section>

  <section class="grid">
    <article>
      <h2>Start Here</h2>
      <ul>
        <li><a href="/chat-ui/docs/quick-start">Quick Start</a></li>
        <li><a href="/chat-ui/docs/overview">Overview</a></li>
        <li><a href="/chat-ui/docs/architecture">Architecture</a></li>
      </ul>
    </article>

    <article>
      <h2>Protocol</h2>
      <ul>
        <li><a href="/chat-ui/docs/protocol">WebChannel v1</a></li>
      </ul>
    </article>

    <article>
      <h2>Build & Ops</h2>
      <ul>
        <li><a href="/chat-ui/docs/development">Development</a></li>
        <li><a href="/chat-ui/docs/testing">Testing</a></li>
        <li><a href="/chat-ui/docs/operations">Operations</a></li>
      </ul>
    </article>

    <article>
      <h2>UX</h2>
      <ul>
        <li><a href="/chat-ui/docs/theming">Theming</a></li>
      </ul>
    </article>
  </section>

  <section class="quickstart">
    <h2>Quick Start</h2>
    <pre><code>git clone https://github.com/nullclaw/nullclaw-chat-ui.git
cd nullclaw-chat-ui
npm install
npm run dev

# open http://localhost:5173
# endpoint: ws://127.0.0.1:32123/ws
# local pairing PIN: 123456
# (requires channels.web in nullclaw config)</code></pre>
  </section>

  <section class="snapshot">
    <h2>Code-Derived Snapshot</h2>
    <p>
      Source basis: `src/lib/protocol/types.ts`, `src/lib/protocol/client.svelte.ts`,
      `src/lib/session/*`, `src/lib/stores/session.svelte.ts`, `src/lib/theme.ts`.
    </p>

    <div class="lists">
      <article>
        <h3>Client → Core Events</h3>
        <p>`pairing_request`, `user_message`, `approval_response`</p>
      </article>

      <article>
        <h3>Core → Client Events</h3>
        <p>
          `pairing_result`, `assistant_chunk`, `assistant_final`, `tool_call`, `tool_result`,
          `approval_request`, `error`
        </p>
      </article>

      <article>
        <h3>State Machine</h3>
        <p>`disconnected` → `connecting` → `pairing` → `paired` → `chatting`</p>
      </article>

      <article>
        <h3>Session Persistence</h3>
        <p>
          `nullclaw_ui_auth_v1`, `nullclaw_ui_theme`, `nullclaw_ui_effects` with TTL cleanup and
          unauthorized reset behavior.
        </p>
      </article>
    </div>
  </section>
</div>

<style>
  .wrap {
    width: min(1120px, 100% - 42px);
    margin: 0 auto;
    padding: 26px 0 52px;
    display: grid;
    gap: 18px;
  }

  section {
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg-surface);
    padding: 22px;
  }

  .hero {
    background:
      linear-gradient(160deg, color-mix(in srgb, var(--accent) 7%, transparent), transparent 45%),
      var(--bg-surface);
  }

  .breadcrumb {
    color: var(--accent-dim);
    font-size: 0.82rem;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
  }

  .breadcrumb a {
    color: inherit;
    text-decoration: none;
  }

  h1 {
    margin: 0;
    font-size: clamp(1.7rem, 4vw, 2.5rem);
  }

  .hero p {
    color: var(--fg-dim);
    line-height: 1.7;
    max-width: 74ch;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 18px 0;
  }

  .btn {
    text-decoration: none;
    padding: 9px 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 700;
  }

  .btn.primary {
    color: var(--fg);
    background: color-mix(in srgb, var(--accent) 20%, transparent);
  }

  .btn.secondary {
    color: var(--accent);
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }

  .metrics article {
    border: 1px dashed var(--border);
    border-radius: 9px;
    padding: 12px;
  }

  .metrics h3 {
    margin: 0;
    color: var(--accent);
    font-size: 1.3rem;
  }

  .metrics p {
    margin: 7px 0 0;
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .grid article {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
    background: color-mix(in srgb, var(--bg) 72%, transparent);
  }

  .grid h2 {
    margin: 0 0 8px;
    font-size: 1rem;
  }

  .grid ul {
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 6px;
  }

  .grid a {
    color: var(--accent);
    text-decoration: none;
  }

  .quickstart pre {
    margin: 0;
    padding: 14px;
    border-radius: 10px;
    background: #000;
    overflow: auto;
    line-height: 1.5;
  }

  .snapshot > p {
    color: var(--fg-dim);
    line-height: 1.6;
  }

  .lists {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .lists article {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
    background: color-mix(in srgb, var(--bg) 72%, transparent);
  }

  .lists h3 {
    margin: 0 0 8px;
    font-size: 0.96rem;
  }

  .lists p {
    margin: 0;
    color: var(--fg-dim);
    line-height: 1.55;
    font-size: 0.9rem;
  }

  @media (max-width: 980px) {
    .grid,
    .lists {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 760px) {
    .wrap {
      width: min(1120px, 100% - 24px);
    }

    section {
      padding: 15px;
    }

    .grid,
    .lists {
      grid-template-columns: 1fr;
    }
  }
</style>
