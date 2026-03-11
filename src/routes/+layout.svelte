<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";

  let { children } = $props();

  const THEME_KEY = "nullclaw_docs_theme";
  const EFFECTS_KEY = "nullclaw_docs_effects";
  const themes = [
    "theme-matrix",
    "theme-8bit-lobster",
    "theme-synthwave",
    "theme-amber",
    "theme-dracula",
    "theme-light",
  ] as const;

  let isScrolled = $state(false);
  let effectsDisabled = $state(true);
  let theme = $state<(typeof themes)[number]>("theme-matrix");
  let themeDropdownOpen = $state(false);

  onMount(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (
      storedTheme &&
      themes.includes(storedTheme as (typeof themes)[number])
    ) {
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

  function handleThemeSelection(t: (typeof themes)[number]) {
    document.body.classList.remove(theme);
    theme = t;
    document.body.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
    themeDropdownOpen = false;
  }

  function getThemeDisplayName(t: string) {
    if (t === "theme-8bit-lobster") return "LOBSTER";
    if (t === "theme-synthwave") return "SYNTH";
    return t.replace("theme-", "").toUpperCase();
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
      <a href="/">Overview</a>
      <a href="/nullclaw/docs/getting-started">Docs</a>
      <a href="https://nullhub.io">NullHub Ecosystem</a>
    </div>

    <div class="nav-controls">
      <button
        class="icon-btn"
        onclick={toggleEffects}
        title="Toggle CRT Effects"
      >
        {effectsDisabled ? "FX:OFF" : "FX:ON"}
      </button>
      {#if themeDropdownOpen}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <div class="dropdown-overlay" onclick={() => themeDropdownOpen = false}></div>
      {/if}
      <div class="theme-dropdown-container">
        <button class="icon-btn theme-select" onclick={() => themeDropdownOpen = !themeDropdownOpen} title="Theme">
          THEME
        </button>
        {#if themeDropdownOpen}
          <div class="theme-dropdown-menu">
            {#each themes as t}
              <button 
                class="theme-option {theme === t ? 'active' : ''}" 
                onclick={() => handleThemeSelection(t)}
              >
                {getThemeDisplayName(t)}
              </button>
            {/each}
          </div>
        {/if}
      </div>
      <a href="https://github.com/nullclaw" target="_blank" class="github-btn"
        >GITHUB</a
      >
    </div>
  </nav>

  <main class="content">
    {@render children()}
  </main>

  <footer>
    <div class="footer-content">
      <p>NullClaw — Autonomous AI agent runtime</p>
      <div class="repo-links">
        <a href="https://github.com/nullclaw/nullclaw" target="_blank"
          >nullclaw</a
        >
        <a href="https://nullhub.io" target="_blank">nullhub.io</a>
      </div>
      <div class="terminal-line">nullclaw@runtime:~# agent --ready _</div>
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
  .theme-select:hover,
  .theme-select:focus,
  .github-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 10px var(--border-glow);
    outline: none;
  }

  .theme-dropdown-container {
    position: relative;
    display: inline-block;
  }

  .dropdown-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 90;
  }

  .theme-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }

  .theme-option {
    background: transparent;
    border: none;
    color: var(--fg);
    padding: 6px 12px;
    font-family: inherit;
    font-size: 0.72rem;
    cursor: pointer;
    text-align: left;
    white-space: nowrap;
    border-radius: 2px;
    transition: all 0.15s ease;
    letter-spacing: 0.06em;
  }

  .theme-option:hover, .theme-option.active {
    background: var(--bg-hover);
    color: var(--accent);
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
    .navbar {
      flex-wrap: wrap;
      height: auto;
      padding-top: 14px;
      padding-bottom: 10px;
    }

    .nav-brand .brand-text {
      font-size: 0.95rem;
    }

    .nav-links {
      order: 3;
      width: 100%;
      overflow-x: auto;
      padding-top: 14px;
      padding-bottom: 4px;
      margin-top: 8px;
      border-top: 1px dashed var(--border);
      justify-content: flex-start;
      -webkit-overflow-scrolling: touch;
    }

    .nav-links::-webkit-scrollbar {
      display: none;
    }

    .nav-links {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .content {
      margin-top: 115px;
    }
  }

  @media (max-width: 680px) {
    .navbar {
      padding-left: 14px;
      padding-right: 14px;
      gap: 8px;
    }

    .nav-brand .brand-text {
      font-size: 0.85rem;
    }

    .nav-brand .bracket {
      display: none;
    }

    .nav-controls {
      gap: 6px;
    }

    .icon-btn,
    .github-btn {
      padding: 6px 8px;
      font-size: 0.68rem;
    }
  }
</style>
