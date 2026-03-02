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
        <div class="label">[ {title.toUpperCase()} ]</div>
    </div>
    <nav class="sidebar-nav">
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
        padding: 30px;
        background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.2));
    }

    .sidebar-header {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px dashed var(--border);
    }

    .sidebar-header .label {
        color: var(--accent);
        font-weight: bold;
        letter-spacing: 2px;
    }

    .nav-section {
        margin-bottom: 30px;
    }

    .nav-section h3 {
        color: var(--fg-dim);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 15px;
    }

    .nav-section ul {
        list-style: none;
        padding: 0;
    }

    .nav-section li {
        margin-bottom: 10px;
    }

    .nav-section a {
        color: var(--fg);
        text-decoration: none;
        display: block;
        padding: 8px 15px;
        border-left: 2px solid transparent;
        transition: all 0.3s ease;
    }

    .nav-section a:hover {
        background: var(--bg-hover);
        color: var(--accent);
        border-left-color: var(--accent-dim);
    }

    .nav-section a.active {
        color: var(--accent);
        border-left-color: var(--accent);
        background: rgba(0, 255, 65, 0.05);
        text-shadow: var(--text-glow);
    }
</style>
