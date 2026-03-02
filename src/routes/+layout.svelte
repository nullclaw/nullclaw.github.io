<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";

  let { children } = $props();

  const THEME_KEY = "nullclaw_docs_theme";
  const EFFECTS_KEY = "nullclaw_docs_effects";
  const themes = [
    "theme-matrix",
    "theme-synthwave",
    "theme-amber",
    "theme-dracula",
    "theme-light",
  ] as const;

  let isScrolled = $state(false);
  let effectsDisabled = $state(true);
  let theme = $state<(typeof themes)[number]>("theme-matrix");

  onMount(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme && themes.includes(storedTheme as (typeof themes)[number])) {
      theme = storedTheme as (typeof themes)[number];
    }

    const storedEffects = localStorage.getItem(EFFECTS_KEY);
    if (storedEffects === "on") {
      effectsDisabled = false;
    }

    document.body.classList.add(theme);
    document.body.classList.toggle("effects-disabled", effectsDisabled);

    const handleScroll = () => {
      isScrolled = window.scrollY > 18;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      document.body.classList.remove(theme);
      window.removeEventListener("scroll", handleScroll);
    };
  });

  function toggleEffects() {
    effectsDisabled = !effectsDisabled;
    document.body.classList.toggle("effects-disabled", effectsDisabled);
    localStorage.setItem(EFFECTS_KEY, effectsDisabled ? "off" : "on");
  }

  function cycleTheme() {
    const currentIdx = themes.indexOf(theme);
    const nextIdx = (currentIdx + 1) % themes.length;

    document.body.classList.remove(theme);
    theme = themes[nextIdx];
    document.body.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }
</script>

<div class="layout">
  <nav class="navbar {isScrolled ? 'scrolled' : ''}">
    <div class="nav-brand">
      <a href="/">
        <span class="bracket">[</span>
        <span class="brand-text">nullclaw ecosystem</span>
        <span class="bracket">]</span>
      </a>
    </div>

    <div class="nav-links">
      <a href="/">Ecosystem</a>
      <a href="/nullclaw/docs/getting-started">NullClaw Docs</a>
      <a href="/chat-ui/docs/quick-start">Chat UI Docs</a>
      <a href="/orchestrator">Roadmap</a>
    </div>

    <div class="nav-controls">
      <button class="icon-btn" onclick={toggleEffects} title="Toggle CRT Effects">
        {effectsDisabled ? "FX:OFF" : "FX:ON"}
      </button>
      <button class="icon-btn" onclick={cycleTheme} title="Cycle Theme">THEME</button>
      <a href="https://github.com/nullclaw" target="_blank" class="github-btn">GITHUB</a>
    </div>
  </nav>

  <main class="content">
    {@render children()}
  </main>

  <footer>
    <div class="footer-content">
      <p>NullClaw ecosystem documentation hub</p>
      <div class="repo-links">
        <a href="https://github.com/nullclaw/nullclaw" target="_blank">nullclaw</a>
        <a href="https://github.com/nullclaw/nullclaw-chat-ui" target="_blank">nullclaw-chat-ui</a>
      </div>
      <div class="terminal-line">root@nullclaw:~# docs --ecosystem _</div>
    </div>
  </footer>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 0 28px;
    z-index: 100;
    transition: all 0.25s ease;
    border-bottom: 1px solid transparent;
  }

  .navbar.scrolled {
    background: var(--bg-surface);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }

  .nav-brand a {
    text-decoration: none;
    font-size: 1rem;
    font-weight: 700;
    color: var(--fg);
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.06em;
  }

  .nav-brand .bracket {
    color: var(--accent-dim);
  }

  .nav-brand .brand-text {
    color: var(--accent);
  }

  .nav-links {
    display: flex;
    gap: 22px;
  }

  .nav-links a {
    text-decoration: none;
    color: var(--fg-dim);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;
    padding-bottom: 2px;
  }

  .nav-links a:hover {
    color: var(--accent);
    border-bottom-color: var(--accent);
    text-shadow: var(--text-glow);
  }

  .nav-controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .icon-btn,
  .github-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--fg);
    padding: 6px 10px;
    font-size: 0.72rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-block;
    letter-spacing: 0.06em;
  }

  .icon-btn:hover,
  .github-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 10px var(--border-glow);
  }

  .github-btn {
    border-color: var(--accent-dim);
    color: var(--accent-dim);
  }

  .content {
    flex: 1;
    margin-top: 70px;
    display: flex;
    flex-direction: column;
  }

  footer {
    padding: 28px;
    border-top: 1px solid var(--border);
    background: var(--bg-surface);
    color: var(--fg-dim);
  }

  .footer-content {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    gap: 12px;
    justify-items: center;
    text-align: center;
  }

  .repo-links {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .repo-links a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dashed var(--accent-dim);
  }

  .repo-links a:hover {
    border-bottom-style: solid;
  }

  .terminal-line {
    color: var(--accent);
    font-family: var(--font-mono);
  }

  @media (max-width: 900px) {
    .nav-links {
      display: none;
    }

    .nav-brand .brand-text {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 680px) {
    .navbar {
      padding: 0 14px;
      gap: 8px;
    }

    .nav-brand .brand-text {
      font-size: 0.78rem;
    }

    .nav-controls {
      gap: 6px;
    }

    .icon-btn,
    .github-btn {
      padding: 5px 7px;
      font-size: 0.66rem;
    }
  }
</style>
