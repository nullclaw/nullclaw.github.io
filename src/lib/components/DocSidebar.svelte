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
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <div class="label">{title}</div>
  </div>

  <nav class="sidebar-nav">
    {#each sections as section}
      <div class="nav-section">
        <h3>{section.title}</h3>
        <ul>
          {#each section.items as item}
            <li>
              <a href={item.href} class={currentPath === item.href ? "active" : ""}>
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
    background: linear-gradient(to right, color-mix(in srgb, var(--bg) 85%, transparent), transparent);
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

  @media (max-width: 980px) {
    .sidebar {
      width: auto;
      min-width: 0;
      position: static;
      max-height: none;
      border-right: 0;
      border-bottom: 1px solid var(--border);
      padding: 12px;
      background: var(--bg-surface);
    }

    .sidebar-header {
      margin-bottom: 10px;
    }

    .sidebar-nav {
      display: grid;
      gap: 10px;
    }

    .nav-section ul {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .nav-section a {
      white-space: nowrap;
      border: 1px solid var(--border);
      border-left: 1px solid var(--border);
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 0.8rem;
    }

    .nav-section a.active {
      border-color: var(--accent);
    }
  }
</style>
