<svelte:head>
  <title>NullClaw Orchestrator (Roadmap)</title>
</svelte:head>

<div class="roadmap">
  <div class="card">
    <div class="breadcrumb"><a href="/">Ecosystem</a> / Orchestrator</div>
    <span class="status">IN DEVELOPMENT</span>
    <h1>Agent Orchestrator</h1>
    <p>
      Planned control plane for coordinating multiple agents, routing workload, and
      exposing orchestration-level observability.
    </p>

    <h2>Planned Scope</h2>
    <ul>
      <li>Task decomposition and delegation policies</li>
      <li>Execution lifecycle with approvals and retries</li>
      <li>Health and cost visibility across agent graphs</li>
    </ul>

    <p class="note">
      This module is intentionally marked as roadmap only. Once implementation lands,
      it will appear here with full docs and examples.
    </p>

    <a href="/" class="back">Back To Ecosystem</a>
  </div>
</div>

<style>
  .roadmap {
    min-height: calc(100vh - 70px - 130px);
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .card {
    width: min(820px, 100%);
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--bg-surface);
    padding: 22px;
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

  .status {
    display: inline-block;
    padding: 4px 8px;
    border: 1px solid var(--warning);
    color: var(--warning);
    border-radius: 999px;
    font-size: 0.74rem;
    letter-spacing: 0.08em;
  }

  h1 {
    margin: 14px 0 10px;
    font-size: clamp(1.6rem, 4vw, 2.4rem);
  }

  p,
  li {
    color: var(--fg-dim);
    line-height: 1.7;
  }

  h2 {
    margin: 18px 0 10px;
    font-size: 1.1rem;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    display: grid;
    gap: 8px;
  }

  .note {
    margin-top: 14px;
    padding: 12px;
    border: 1px dashed var(--border);
    border-radius: 10px;
    background: color-mix(in srgb, var(--bg) 72%, transparent);
  }

  .back {
    display: inline-block;
    margin-top: 18px;
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dashed var(--accent-dim);
  }

  .back:hover {
    border-bottom-style: solid;
  }
</style>
