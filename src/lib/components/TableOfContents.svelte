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
      if (!id) return;
      entries.push({
        id,
        text: el.textContent || "",
        level: parseInt(el.tagName[1]),
      });
    });

    return entries;
  });

  let activeId = $state("");

  $effect(() => {
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
        rootMargin: "-78px 0px -62% 0px",
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
    <div class="toc-header">On This Page</div>
    <ul>
      {#each headings as heading}
        <li class="level-{heading.level}">
          <a href="#{heading.id}" class={activeId === heading.id ? "active" : ""}>
            {heading.text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .toc {
    width: 250px;
    min-width: 250px;
    position: sticky;
    top: 92px;
    align-self: flex-start;
    padding: 20px 14px;
    max-height: calc(100vh - 108px);
    overflow-y: auto;
    border-left: 1px dashed var(--border);
  }

  .toc-header {
    color: var(--fg-dim);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 3px;
  }

  li.level-3 {
    padding-left: 12px;
  }

  a {
    color: var(--fg-dim);
    text-decoration: none;
    font-size: 0.8rem;
    display: block;
    padding: 4px 8px;
    border-left: 2px solid transparent;
    line-height: 1.4;
    border-radius: 4px;
  }

  a:hover {
    color: var(--accent);
    border-left-color: var(--accent-dim);
    background: color-mix(in srgb, var(--bg) 80%, transparent);
  }

  a.active {
    color: var(--accent);
    border-left-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 9%, transparent);
  }

  @media (max-width: 1200px) {
    .toc {
      display: none;
    }
  }
</style>
