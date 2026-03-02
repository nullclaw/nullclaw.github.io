<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";

  let { children } = $props();

  let isScrolled = $state(false);
  let effectsDisabled = $state(true);
  let theme = $state("theme-matrix");

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 20;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  function toggleEffects() {
    effectsDisabled = !effectsDisabled;
    if (effectsDisabled) {
      document.body.classList.add("effects-disabled");
    } else {
      document.body.classList.remove("effects-disabled");
    }
  }

  function cycleTheme() {
    const themes = [
      "theme-matrix",
      "theme-synthwave",
      "theme-amber",
      "theme-dracula",
      "theme-light",
    ];
    const currentIdx = themes.indexOf(theme);
    const nextIdx = (currentIdx + 1) % themes.length;

    document.body.classList.remove(theme);
    theme = themes[nextIdx];
    document.body.classList.add(theme);
  }
</script>

<div class="layout">
  <nav class="navbar {isScrolled ? 'scrolled' : ''}">
    <div class="nav-brand">
      <a href="/">
        <span class="bracket">[</span> <span class="brand-text">nullclaw</span>
        <span class="bracket">]</span>
      </a>
    </div>
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/nullclaw/docs/getting-started">Nullclaw</a>
      <a href="/chat-ui/docs/overview">Chat UI</a>
    </div>
    <div class="nav-controls">
      <button
        class="icon-btn"
        onclick={toggleEffects}
        title="Toggle CRT Effects"
      >
        {effectsDisabled ? "CRT:OFF" : "CRT:ON"}
      </button>
      <button class="icon-btn" onclick={cycleTheme} title="Cycle Theme">
        THEME
      </button>
      <a
        href="https://github.com/nullclaw"
        target="_blank"
        class="github-btn"
      >
        GITHUB
      </a>
    </div>
  </nav>

  <main class="content">
    {@render children()}
  </main>

  <footer>
    <div class="footer-content">
      <div class="tech-links">
        <a href="https://ziglang.org" target="_blank" class="tech-link">
          <span class="icon">[ ZIG ]</span>
          <span
            >Zero hidden control flow, no hidden memory allocation, no
            preprocessor.</span
          >
        </a>
        <a href="https://svelte.dev" target="_blank" class="tech-link">
          <span class="icon">[ SVELTE ]</span>
          <span>Cybernetically enhanced web apps. Compile-time framework.</span>
        </a>
      </div>
      <p>System NullClaw v1.0.0 - Fully Autonomous AI Infrastructure</p>
      <div class="terminal-line">root@nullclaw:~# _</div>
    </div>
  </footer>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Navbar */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    z-index: 100;
    transition: all 0.3s ease;
    border-bottom: 1px solid transparent;
  }

  .navbar.scrolled {
    background: var(--bg-surface);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .nav-brand a {
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--fg);
    display: flex;
    align-items: center;
    gap: 8px;
    text-shadow: var(--text-glow);
  }

  .nav-brand .bracket {
    color: var(--accent-dim);
  }

  .nav-brand .brand-text {
    color: var(--accent);
    letter-spacing: 2px;
  }

  .nav-links {
    display: flex;
    gap: 30px;
  }

  .nav-links a {
    text-decoration: none;
    color: var(--fg-dim);
    font-size: 1.1rem;
    transition:
      color 0.3s,
      text-shadow 0.3s;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
  }

  .nav-links a:hover {
    color: var(--accent);
    text-shadow: var(--text-glow);
  }

  .nav-links a::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--accent);
    transition: width 0.3s ease;
    box-shadow: 0 0 5px var(--accent);
  }

  .nav-links a:hover::after {
    width: 100%;
  }

  .nav-controls {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .icon-btn,
  .github-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--fg);
    padding: 6px 12px;
    font-size: 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }

  .icon-btn:hover,
  .github-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 10px var(--border-glow);
    text-shadow: var(--text-glow);
  }

  .github-btn {
    border-color: var(--accent-dim);
    color: var(--accent-dim);
  }

  /* Content Area */
  .content {
    flex: 1;
    margin-top: 70px; /* Offset for fixed navbar */
    display: flex;
    flex-direction: column;
  }

  /* Footer */
  footer {
    padding: 40px 40px;
    border-top: 1px solid var(--border);
    background: var(--bg-surface);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--fg-dim);
    font-size: 0.9rem;
    position: relative;
    overflow: hidden;
  }

  .footer-content {
    text-align: center;
    max-width: 800px;
  }

  .tech-links {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .tech-link {
    text-decoration: none;
    color: var(--fg-dim);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 15px;
    border: 1px dashed var(--border);
    border-radius: 4px;
    transition: all 0.3s ease;
    flex: 1;
    min-width: 250px;
  }

  .tech-link .icon {
    font-weight: bold;
    color: var(--accent);
    letter-spacing: 2px;
  }

  .tech-link:hover {
    border-style: solid;
    border-color: var(--accent);
    background: var(--bg-hover);
    color: var(--fg);
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.1);
  }

  .terminal-line {
    margin-top: 15px;
    color: var(--accent);
    font-family: var(--font-mono);
    animation: blinkCursor 1s infinite alternate;
  }
</style>
