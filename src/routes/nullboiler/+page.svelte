<svelte:head>
  <title>NullBoiler Documentation</title>
</svelte:head>

<div class="wrap">
  <section class="hero">
    <div class="breadcrumb"><a href="/">Ecosystem</a> / NullBoiler</div>
    <h1>NullBoiler Workflow Orchestrator</h1>
    <p>
      Zig-based orchestration runtime for DAG-style workflows, step scheduling,
      worker dispatch, approvals, retries, and operational run/event APIs.
    </p>

    <div class="actions">
      <a href="/nullboiler/docs/quick-start" class="btn primary">Quick Start</a>
      <a href="/nullboiler/docs/api" class="btn secondary">API</a>
      <a href="https://github.com/nullclaw/nullboiler" target="_blank" class="btn secondary">GitHub</a>
    </div>

    <div class="metrics">
      <article><h3>18</h3><p>API route patterns in `src/api.zig`</p></article>
      <article><h3>14</h3><p>step types supported by engine</p></article>
      <article><h3>3</h3><p>worker protocols (webhook/api_chat/openai_chat)</p></article>
      <article><h3>9</h3><p>SQLite tables (core + advanced migrations)</p></article>
    </div>
  </section>

  <section class="grid">
    <article>
      <h2>Start Here</h2>
      <ul>
        <li><a href="/nullboiler/docs/quick-start">Quick Start</a></li>
        <li><a href="/nullboiler/docs/overview">Overview</a></li>
        <li><a href="/nullboiler/docs/architecture">Architecture</a></li>
      </ul>
    </article>

    <article>
      <h2>Execution Model</h2>
      <ul>
        <li><a href="/nullboiler/docs/step-types">Step Types</a></li>
        <li><a href="/nullboiler/docs/worker-protocols">Worker Protocols</a></li>
      </ul>
    </article>

    <article>
      <h2>Reference</h2>
      <ul>
        <li><a href="/nullboiler/docs/api">API</a></li>
      </ul>
    </article>

    <article>
      <h2>Operate</h2>
      <ul>
        <li><a href="/nullboiler/docs/operations">Operations</a></li>
      </ul>
    </article>
  </section>

  <section class="quickstart">
    <h2>Quick Start</h2>
    <pre><code>git clone https://github.com/nullclaw/nullboiler.git
cd nullboiler
zig build -Doptimize=ReleaseSmall

# terminal 1: mock worker endpoint (from repo tests)
python3 tests/mock_worker.py 9999

# terminal 2: run orchestrator
./zig-out/bin/nullboiler --port 8080 --db /tmp/nullboiler.db

# register worker (webhook requires explicit URL path)
curl -s -X POST http://127.0.0.1:8080/workers \
  -H 'Content-Type: application/json' \
  -d '&#123;"id":"test-worker-1","url":"http://127.0.0.1:9999/webhook","token":"dev","tags":["tester"],"max_concurrent":2&#125;'

# create run
curl -s -X POST http://127.0.0.1:8080/runs \
  -H 'Content-Type: application/json' \
  -d '&#123;"steps":[&#123;"id":"step1","type":"task","worker_tags":["tester"],"prompt_template":"Hello &#123;&#123;input.name&#125;&#125;"&#125;],"input":&#123;"name":"World"&#125;&#125;'</code></pre>
  </section>

  <section class="snapshot">
    <h2>Code-Derived Snapshot</h2>
    <p>
      Source basis: `src/main.zig`, `src/api.zig`, `src/engine.zig`,
      `src/workflow_validation.zig`, `src/worker_protocol.zig`, and migrations in
      `src/migrations`.
    </p>

    <div class="lists">
      <article>
        <h3>Core Step Types</h3>
        <p>
          `task`, `fan_out`, `map`, `reduce`, `condition`, `approval`, `transform`,
          `wait`, `router`, `loop`, `sub_workflow`, `debate`, `group_chat`, `saga`.
        </p>
      </article>

      <article>
        <h3>Auth Model</h3>
        <p>
          Optional global bearer auth via `--token` / `api_token`; `GET /health` and
          `GET /metrics` remain unauthenticated.
        </p>
      </article>

      <article>
        <h3>Workflow Validation</h3>
        <p>
          `POST /runs` rejects invalid graphs: duplicate step ids, unknown
          `depends_on`, missing required fields for `wait`, `router`, `saga`,
          `group_chat`, and invalid retry/timeout controls.
        </p>
      </article>

      <article>
        <h3>Worker Protocol Rules</h3>
        <p>
          `openai_chat` requires `model`; `webhook` URLs must include explicit path
          (for example `/webhook`); dispatch selects active workers by tag overlap and
          capacity.
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
