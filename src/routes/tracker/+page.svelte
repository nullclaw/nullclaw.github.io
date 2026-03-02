<svelte:head>
  <title>NullTracker Alias</title>
</svelte:head>

<div class="roadmap">
  <div class="card">
    <div class="breadcrumb"><a href="/">Ecosystem</a> / NullTracker</div>
    <span class="status">ACTIVE (ALIAS)</span>
    <h1>NullTracker = NullTickets</h1>
    <p>
      In the current ecosystem docs, the tracker control plane is published as
      <strong>NullTickets</strong>. This page is kept as a stable alias for navigation.
    </p>

    <h2>Go To Active Docs</h2>
    <ul>
      <li><a href="/nulltickets/docs/quick-start">NullTickets Quick Start</a></li>
      <li><a href="/nulltickets/docs/api">NullTickets API</a></li>
      <li><a href="https://github.com/nullclaw/nulltickets" target="_blank">GitHub: nulltickets</a></li>
    </ul>

    <a href="/nulltickets" class="back">Open NullTickets Section</a>
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
    border: 1px solid var(--accent);
    color: var(--accent);
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

  ul a {
    color: var(--accent);
    text-decoration: none;
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
