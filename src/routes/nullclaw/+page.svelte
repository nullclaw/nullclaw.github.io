<svelte:head>
  <title>NullClaw Documentation</title>
</svelte:head>

<div class="wrap">
  <section class="hero">
    <div class="breadcrumb"><a href="/">Ecosystem</a> / NullClaw</div>
    <h1>NullClaw Core Runtime</h1>
    <p>
      Fastest, smallest, and fully autonomous AI assistant infrastructure written in Zig.
      This page is optimized for docs navigation and operational onboarding.
    </p>

    <div class="actions">
      <a href="/nullclaw/docs/getting-started" class="btn primary">Quick Start</a>
      <a href="/nullclaw/docs/cli" class="btn secondary">CLI Reference</a>
      <a href="https://github.com/nullclaw/nullclaw" target="_blank" class="btn secondary">GitHub</a>
    </div>

    <div class="metrics">
      <article><h3>19</h3><p>top-level CLI commands</p></article>
      <article><h3>20</h3><p>channels in `channel_catalog`</p></article>
      <article><h3>89</h3><p>compatible provider aliases</p></article>
      <article><h3>34</h3><p>tool specs in `src/tools/*`</p></article>
      <article><h3>9</h3><p>known memory backends</p></article>
    </div>
  </section>

  <section class="grid">
    <article>
      <h2>Start Here</h2>
      <ul>
        <li><a href="/nullclaw/docs/getting-started">Quick Start</a></li>
        <li><a href="/nullclaw/docs/overview">Overview</a></li>
        <li><a href="/nullclaw/docs/architecture">Architecture</a></li>
      </ul>
    </article>

    <article>
      <h2>Configure</h2>
      <ul>
        <li><a href="/nullclaw/docs/configuration">Configuration</a></li>
        <li><a href="/nullclaw/docs/providers">Providers</a></li>
        <li><a href="/nullclaw/docs/channels">Channels</a></li>
      </ul>
    </article>

    <article>
      <h2>Operate</h2>
      <ul>
        <li><a href="/nullclaw/docs/tools">Tools</a></li>
        <li><a href="/nullclaw/docs/memory">Memory</a></li>
        <li><a href="/nullclaw/docs/security">Security</a></li>
      </ul>
    </article>

    <article>
      <h2>Reference</h2>
      <ul>
        <li><a href="/nullclaw/docs/cli">CLI</a></li>
      </ul>
    </article>
  </section>

  <section class="quickstart">
    <h2>Quick Start</h2>
    <pre><code>git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw
zig build -Doptimize=ReleaseSmall

# setup + run core runtime
./zig-out/bin/nullclaw onboard --provider openrouter --api-key &lt;API_KEY&gt;
./zig-out/bin/nullclaw gateway

# Chat UI requires channels.web in ~/.nullclaw/config.json
# endpoint: ws://127.0.0.1:32123/ws
# pairing PIN (local mode): 123456</code></pre>
  </section>

  <section class="snapshot">
    <h2>Code-Derived Capability Snapshot</h2>
    <p>
      Source basis: `src/main.zig`, `src/channel_catalog.zig`, `src/providers/factory.zig`,
      `src/tools/*`, `src/memory/engines/registry.zig`.
    </p>

    <div class="lists">
      <article>
        <h3>CLI Domains</h3>
        <p>
          agent, gateway, service, status, onboard, doctor, cron, channel, skills, hardware,
          migrate, memory, workspace, capabilities, models, auth, update.
        </p>
      </article>

      <article>
        <h3>Channel Matrix</h3>
        <p>
          cli, telegram, discord, slack, webhook, imessage, matrix, mattermost, whatsapp, irc,
          lark, dingtalk, signal, email, line, qq, onebot, maixcam, nostr, web.
        </p>
      </article>

      <article>
        <h3>Core Tools</h3>
        <p>
          shell, file_read, file_write, file_edit, git, image_info, memory_store, memory_recall,
          memory_list, memory_forget, delegate, schedule, spawn.
        </p>
      </article>

      <article>
        <h3>Optional Tools</h3>
        <p>
          http_request, browser, screenshot, composio, browser_open, hardware_board_info,
          hardware_memory, i2c.
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
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
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
