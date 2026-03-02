<svelte:head>
  <title>NullTickets Documentation</title>
</svelte:head>

<div class="wrap">
  <section class="hero">
    <div class="breadcrumb"><a href="/">Ecosystem</a> / NullTickets</div>
    <h1>NullTickets Task Control Plane</h1>
    <p>
      Zig task-state backend for autonomous delivery systems: pipeline definitions,
      queueing, lease-based claiming, stage transitions, gate checks, artifacts,
      and operational queue analytics.
    </p>

    <div class="actions">
      <a href="/nulltickets/docs/quick-start" class="btn primary">Quick Start</a>
      <a href="/nulltickets/docs/api" class="btn secondary">API</a>
      <a href="https://github.com/nullclaw/nulltickets" target="_blank" class="btn secondary">GitHub</a>
    </div>

    <div class="metrics">
      <article><h3>21</h3><p>API route paths (`src/openapi.json`)</p></article>
      <article><h3>12</h3><p>SQLite tables in initial migration</p></article>
      <article><h3>2</h3><p>OTLP ingest endpoints (`/v1/traces`, `/otlp/v1/traces`)</p></article>
      <article><h3>300s</h3><p>default lease TTL for claim/heartbeat</p></article>
    </div>
  </section>

  <section class="grid">
    <article>
      <h2>Start Here</h2>
      <ul>
        <li><a href="/nulltickets/docs/quick-start">Quick Start</a></li>
        <li><a href="/nulltickets/docs/overview">Overview</a></li>
        <li><a href="/nulltickets/docs/architecture">Architecture</a></li>
      </ul>
    </article>

    <article>
      <h2>Execution Model</h2>
      <ul>
        <li><a href="/nulltickets/docs/pipeline-model">Pipeline Model</a></li>
        <li><a href="/nulltickets/docs/api">API</a></li>
      </ul>
    </article>

    <article>
      <h2>Operate</h2>
      <ul>
        <li><a href="/nulltickets/docs/operations">Operations</a></li>
      </ul>
    </article>

    <article>
      <h2>Alias</h2>
      <ul>
        <li><a href="/tracker">NullTracker Alias Page</a></li>
      </ul>
    </article>
  </section>

  <section class="quickstart">
    <h2>Quick Start</h2>
    <pre><code>git clone https://github.com/nullclaw/nulltickets.git
cd nulltickets
zig build -Doptimize=ReleaseSmall
./zig-out/bin/nulltickets --port 7700 --db /tmp/nulltickets.db

# health + openapi discovery
curl -s http://127.0.0.1:7700/health
curl -s http://127.0.0.1:7700/openapi.json

# create pipeline
curl -s -X POST http://127.0.0.1:7700/pipelines \
  -H 'Content-Type: application/json' \
  -d '&#123;"name":"dev-pipeline","definition":&#123;"initial":"research","states":&#123;"research":&#123;"agent_role":"researcher"&#125;,"coding":&#123;"agent_role":"coder"&#125;,"done":&#123;"terminal":true&#125;&#125;,"transitions":[&#123;"from":"research","to":"coding","trigger":"complete"&#125;,&#123;"from":"coding","to":"done","trigger":"complete"&#125;]&#125;&#125;'

# claim work for a role
curl -s -X POST http://127.0.0.1:7700/leases/claim \
  -H 'Content-Type: application/json' \
  -d '&#123;"agent_id":"researcher-1","agent_role":"researcher"&#125;'</code></pre>
  </section>

  <section class="snapshot">
    <h2>Code-Derived Snapshot</h2>
    <p>
      Source basis: `src/main.zig`, `src/api.zig`, `src/domain.zig`, `src/store.zig`,
      `src/migrations/001_init.sql`, and `src/openapi.json`.
    </p>

    <div class="lists">
      <article>
        <h3>Pipeline Validation Rules</h3>
        <p>
          Definitions must include valid `initial`, known transition states,
          at least one terminal state, and outgoing transitions for each
          non-terminal state.
        </p>
      </article>

      <article>
        <h3>Claim + Lease Security</h3>
        <p>
          Worker agents claim tasks by role, receive `lease_token`, and then must
          call run mutation endpoints with `Authorization: Bearer &lt;lease_token&gt;`.
        </p>
      </article>

      <article>
        <h3>Idempotent Writes</h3>
        <p>
          Write endpoints support `Idempotency-Key`; key reuse with different body
          returns `409 idempotency_conflict`.
        </p>
      </article>

      <article>
        <h3>Quality Gates + Ops</h3>
        <p>
          Stage transitions can require gates (`required_gates`) and queue-level stats
          are available via `GET /ops/queue` (`claimable`, `stuck`, `near_expiry`).
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
      linear-gradient(165deg, color-mix(in srgb, var(--accent) 9%, transparent), transparent 45%),
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
    font-size: clamp(1.7rem, 4vw, 2.6rem);
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
    font-size: 1rem;
  }

  .lists p {
    margin: 0;
    color: var(--fg-dim);
    line-height: 1.65;
    font-size: 0.92rem;
  }

  @media (max-width: 1100px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 840px) {
    .lists,
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
