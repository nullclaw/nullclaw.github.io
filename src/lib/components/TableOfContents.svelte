<script lang="ts">
    interface TocEntry {
        id: string;
        text: string;
        level: number;
    }

    let { content }: { content: string } = $props();

    let headings = $derived.by(() => {
        if (typeof globalThis.DOMParser === "undefined") return [];
        const entries: TocEntry[] = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const elements = doc.querySelectorAll("h2, h3");

        elements.forEach((el) => {
            const id = el.getAttribute("id");
            if (id) {
                entries.push({
                    id,
                    text: el.textContent || "",
                    level: parseInt(el.tagName[1]),
                });
            }
        });

        return entries;
    });

    let activeId = $state("");

    $effect(() => {
        // Re-run whenever headings change (e.g. client-side navigation)
        const _deps = headings;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        activeId = entry.target.id;
                    }
                }
            },
            {
                rootMargin: "-70px 0px -60% 0px",
                threshold: 0,
            },
        );

        const elements = document.querySelectorAll("h2[id], h3[id]");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    });
</script>

{#if headings.length > 0}
    <nav class="toc">
        <div class="toc-header">ON THIS PAGE</div>
        <ul>
            {#each headings as heading}
                <li class="level-{heading.level}">
                    <a
                        href="#{heading.id}"
                        class={activeId === heading.id ? "active" : ""}
                    >
                        {heading.text}
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
{/if}

<style>
    .toc {
        width: 240px;
        min-width: 240px;
        position: sticky;
        top: 100px;
        align-self: flex-start;
        padding: 20px;
        max-height: calc(100vh - 120px);
        overflow-y: auto;
    }

    .toc-header {
        color: var(--fg-dim);
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px dashed var(--border);
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        margin-bottom: 4px;
    }

    li.level-3 {
        padding-left: 15px;
    }

    a {
        color: var(--fg-dim);
        text-decoration: none;
        font-size: 0.85rem;
        display: block;
        padding: 4px 10px;
        border-left: 2px solid transparent;
        transition: all 0.2s ease;
        line-height: 1.4;
    }

    a:hover {
        color: var(--accent);
        border-left-color: var(--accent-dim);
    }

    a.active {
        color: var(--accent);
        border-left-color: var(--accent);
        text-shadow: var(--text-glow);
    }

    @media (max-width: 1200px) {
        .toc {
            display: none;
        }
    }
</style>
