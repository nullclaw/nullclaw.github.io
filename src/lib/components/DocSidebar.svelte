<script lang="ts">
  import { page } from "$app/stores";

  interface SidebarItem {
    label: string;
    href: string;
  }

  interface SidebarSection {
    title: string;
    items: SidebarItem[];
  }

  let { title, sections }: { title: string; sections: SidebarSection[] } =
    $props();

  let currentPath = $derived($page.url.pathname);
  let menuOpen = $state(false);
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <div class="label">{title}</div>
    <button class="mobile-toggle" onclick={() => (menuOpen = !menuOpen)}>
      {menuOpen ? "Close Menu" : "Menu"}
    </button>
  </div>

  <nav class="sidebar-nav" class:open={menuOpen}>
    {#each sections as section}
      <div class="nav-section">
        <h3>{section.title}</h3>
        <ul>
          {#each section.items as item}
            <li>
              <a
                href={item.href}
                class={currentPath === item.href ? "active" : ""}
              >
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    width: 280px;
    min-width: 280px;
    border-right: 1px solid var(--border);
    padding: 24px 18px;
    background: linear-gradient(
      to right,
      color-mix(in srgb, var(--bg) 85%, transparent),
      transparent
    );
    position: sticky;
    top: 70px;
    align-self: start;
    max-height: calc(100vh - 70px);
    overflow: auto;
  }

  .sidebar-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px dashed var(--border);
  }

  .label {
    color: var(--accent);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.82rem;
  }

  .nav-section + .nav-section {
    margin-top: 16px;
  }

  .nav-section h3 {
    color: var(--fg-dim);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 0 0 8px;
  }

  .nav-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 4px;
  }

  .nav-section a {
    color: var(--fg);
    text-decoration: none;
    display: block;
    padding: 7px 10px;
    border-left: 2px solid transparent;
    border-radius: 6px;
    font-size: 0.86rem;
  }

  .nav-section a:hover {
    background: var(--bg-hover);
    color: var(--accent);
    border-left-color: var(--accent-dim);
  }

  .nav-section a.active {
    color: var(--accent);
    border-left-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 9%, transparent);
  }

  .mobile-toggle {
    display: none;
  }

  @media (max-width: 980px) {
    .sidebar {
      width: auto;
      min-width: 0;
      position: static;
      max-height: none;
      border-right: 0;
      border-bottom: 1px solid var(--border);
      padding: 14px 18px;
      background: var(--bg-surface);
    }

    .sidebar-header {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mobile-toggle {
      display: block;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--fg);
      padding: 6px 12px;
      font-size: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .sidebar-nav {
      display: none;
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px dashed var(--border);
      gap: 16px;
    }

    .sidebar-nav.open {
      display: grid;
    }
  }
</style>
