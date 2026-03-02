<svelte:head>
  <title>NullClaw | AI Task Tracker</title>
</svelte:head>

<div class="coming-soon">
  <div class="content">
    <div class="breadcrumb">
      <a href="/">NULLCLAW ECOSYSTEM</a> / TASK TRACKER
    </div>
    <div class="status-badge">[ IN DEVELOPMENT ]</div>
    <h1>AI TASK TRACKER</h1>
    <p>Autonomous issue resolution and board management interface engineered for AI agents.</p>
    <div class="terminal-line">&gt; Status: classified // access denied<span class="cursor">_</span></div>
    <a href="/" class="back-link">&larr; Back to Ecosystem</a>
  </div>
</div>

<style>
  .coming-soon {
    min-height: calc(100vh - 70px - 85px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }
  .content { text-align: center; max-width: 600px; }
  .breadcrumb {
    color: var(--fg-dim);
    font-size: 0.85rem;
    letter-spacing: 2px;
    margin-bottom: 30px;
  }
  .breadcrumb a {
    color: var(--accent-dim);
    text-decoration: none;
  }
  .breadcrumb a:hover {
    color: var(--accent);
    text-shadow: var(--text-glow);
  }
  .status-badge {
    display: inline-block;
    color: var(--warning);
    border: 1px solid var(--warning);
    padding: 6px 15px;
    font-size: 0.85rem;
    letter-spacing: 2px;
    margin-bottom: 30px;
  }
  h1 {
    font-size: 3rem;
    letter-spacing: 8px;
    margin-bottom: 20px;
    color: var(--fg);
    text-shadow: 0 0 20px var(--accent);
  }
  p {
    color: var(--fg-dim);
    line-height: 1.6;
    margin-bottom: 40px;
    font-size: 1.1rem;
  }
  .terminal-line {
    color: var(--warning);
    margin-bottom: 40px;
    font-size: 1rem;
  }
  .cursor {
    display: inline-block;
    width: 10px;
    height: 1em;
    background: var(--warning);
    animation: blinkCursor 1s infinite;
    vertical-align: middle;
  }
  .back-link {
    color: var(--accent);
    text-decoration: none;
    font-size: 0.9rem;
    letter-spacing: 1px;
  }
  .back-link:hover { text-shadow: var(--text-glow); }
</style>
