# Documentation Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure nullclaw.io from a single-project landing into a multi-project documentation hub with full docs for nullclaw core (9 pages) and chat-ui (6 pages), plus ToC and improved sidebar UX.

**Architecture:** Multi-project routing where each product gets its own route prefix (`/nullclaw/docs/[slug]`, `/chat-ui/docs/[slug]`). Shared reusable components for markdown rendering, sidebar navigation, and table of contents. Content stored as markdown files in `src/lib/docs/{project}/`.

**Tech Stack:** SvelteKit 2 (static adapter), Svelte 5 (runes), marked + highlight.js + DOMPurify for markdown, existing cyberpunk theme system (5 themes).

---

## Phase 1: Site Restructure + Nullclaw Docs

### Task 1: Create reusable DocSidebar component

**Files:**
- Create: `src/lib/components/DocSidebar.svelte`

**Context:** Currently the sidebar is hardcoded in `src/routes/docs/+layout.svelte`. We need a reusable component that accepts a navigation config and highlights the active link.

**Step 1: Create the DocSidebar component**

```svelte
<script lang="ts">
  import { page } from "$app/stores";

  interface NavItem {
    label: string;
    href: string;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  interface Props {
    title: string;
    sections: NavSection[];
  }

  let { title, sections }: Props = $props();
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <div class="label">[ {title} ]</div>
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
                class={$page.url.pathname === item.href ? "active" : ""}
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
```

Copy the sidebar styles from `src/routes/docs/+layout.svelte` into this component's `<style>` block (the `.sidebar`, `.sidebar-header`, `.sidebar-nav`, `.nav-section` styles).

**Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add src/lib/components/DocSidebar.svelte
git commit -m "feat: add reusable DocSidebar component"
```

---

### Task 2: Create TableOfContents component

**Files:**
- Create: `src/lib/components/TableOfContents.svelte`

**Context:** Auto-generated from markdown H2/H3 headings. Displayed on the right side on wide screens, highlights current section on scroll.

**Step 1: Create the ToC component**

```svelte
<script lang="ts">
  import { onMount } from "svelte";

  interface TocItem {
    id: string;
    text: string;
    level: number;
  }

  let { content }: { content: string } = $props();
  let tocItems = $state<TocItem[]>([]);
  let activeId = $state("");

  $effect(() => {
    // Parse headings from rendered HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h2, h3");
    tocItems = Array.from(headings).map((h) => ({
      id: h.id || h.textContent!.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      text: h.textContent || "",
      level: parseInt(h.tagName[1]),
    }));
  });

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    // Observe headings in the actual DOM
    const headings = document.querySelectorAll(".docs-content h2, .docs-content h3");
    headings.forEach((h) => {
      if (!h.id) {
        h.id = h.textContent!.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      observer.observe(h);
    });

    return () => observer.disconnect();
  });
</script>

{#if tocItems.length > 0}
  <nav class="toc">
    <div class="toc-header">ON THIS PAGE</div>
    <ul>
      {#each tocItems as item}
        <li class="level-{item.level}">
          <a
            href="#{item.id}"
            class={activeId === item.id ? "active" : ""}
          >
            {item.text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  .toc {
    position: sticky;
    top: 90px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 20px;
    width: 240px;
    flex-shrink: 0;
  }

  .toc-header {
    color: var(--fg-dim);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 15px;
    font-weight: bold;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 6px;
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
  }

  a:hover {
    color: var(--accent);
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
```

**Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/lib/components/TableOfContents.svelte
git commit -m "feat: add TableOfContents component with scroll tracking"
```

---

### Task 3: Update markdown renderer to add heading IDs

**Files:**
- Modify: `src/lib/markdown.ts`

**Context:** Markdown headings need `id` attributes for ToC anchor links. Use `marked`'s renderer override.

**Step 1: Add heading ID generation to marked config**

In `src/lib/markdown.ts`, add a custom renderer before `renderMarkdown`:

```typescript
import { marked, Renderer } from 'marked';
// ... existing imports ...

const renderer = new Renderer();
renderer.heading = function ({ text, depth }: { text: string; depth: number }) {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.use({ renderer });
```

Add this **after** the `marked.use(markedHighlight(...))` call so it doesn't get overwritten.

**Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/lib/markdown.ts
git commit -m "feat: add heading IDs to markdown renderer for ToC anchors"
```

---

### Task 4: Create reusable DocPage layout component

**Files:**
- Create: `src/lib/components/DocsLayout.svelte`

**Context:** Shared layout for all doc pages: sidebar + content + ToC. This avoids duplicating layout code across `/nullclaw/docs/` and `/chat-ui/docs/`.

**Step 1: Create the layout component**

```svelte
<script lang="ts">
  import DocSidebar from "./DocSidebar.svelte";
  import TableOfContents from "./TableOfContents.svelte";
  import type { Snippet } from "svelte";

  interface NavItem {
    label: string;
    href: string;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  interface Props {
    sidebarTitle: string;
    sections: NavSection[];
    tocContent?: string;
    children: Snippet;
  }

  let { sidebarTitle, sections, tocContent = "", children }: Props = $props();
</script>

<div class="docs-layout">
  <DocSidebar title={sidebarTitle} {sections} />

  <div class="docs-content markdown-body">
    {@render children()}
  </div>

  {#if tocContent}
    <TableOfContents content={tocContent} />
  {/if}
</div>

<style>
  .docs-layout {
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    min-height: calc(100vh - 70px - 85px);
  }

  .docs-content {
    flex: 1;
    padding: 40px 60px;
    max-width: 900px;
    min-width: 0;
  }
</style>
```

**Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/lib/components/DocsLayout.svelte
git commit -m "feat: add shared DocsLayout component (sidebar + content + ToC)"
```

---

### Task 5: Create nullclaw docs routes

**Files:**
- Create: `src/routes/nullclaw/+page.svelte` (project landing — placeholder for now)
- Create: `src/routes/nullclaw/docs/+layout.svelte`
- Create: `src/routes/nullclaw/docs/+page.server.ts`
- Create: `src/routes/nullclaw/docs/[slug]/+page.svelte`
- Create: `src/routes/nullclaw/docs/[slug]/+page.ts`

**Step 1: Create the nullclaw project landing placeholder**

`src/routes/nullclaw/+page.svelte`:
```svelte
<svelte:head>
  <title>NullClaw | AI Assistant Infrastructure</title>
</svelte:head>

<div style="padding: 80px 40px; text-align: center;">
  <h1>NullClaw</h1>
  <p style="color: var(--fg-dim); margin-top: 20px;">Project landing — coming in Task 9</p>
  <a href="/nullclaw/docs/getting-started" style="color: var(--accent); margin-top: 20px; display: inline-block;">Go to docs &rarr;</a>
</div>
```

**Step 2: Create docs layout with nullclaw sidebar config**

`src/routes/nullclaw/docs/+layout.svelte`:
```svelte
<script lang="ts">
  import DocsLayout from "$lib/components/DocsLayout.svelte";

  let { children, data } = $props();

  const sections = [
    {
      title: "Getting Started",
      items: [
        { label: "Quick Start", href: "/nullclaw/docs/getting-started" },
        { label: "Architecture", href: "/nullclaw/docs/architecture" },
        { label: "Configuration", href: "/nullclaw/docs/configuration" },
      ],
    },
    {
      title: "Components",
      items: [
        { label: "Providers", href: "/nullclaw/docs/providers" },
        { label: "Channels", href: "/nullclaw/docs/channels" },
        { label: "Tools", href: "/nullclaw/docs/tools" },
        { label: "Memory", href: "/nullclaw/docs/memory" },
      ],
    },
    {
      title: "Reference",
      items: [
        { label: "Security", href: "/nullclaw/docs/security" },
        { label: "CLI", href: "/nullclaw/docs/cli" },
      ],
    },
  ];
</script>

<DocsLayout sidebarTitle="NULLCLAW DOCS" {sections} tocContent={data?.content ?? ""}>
  {@render children()}
</DocsLayout>
```

**Step 3: Create redirect and page loader**

`src/routes/nullclaw/docs/+page.server.ts`:
```typescript
import { redirect } from '@sveltejs/kit';

export const prerender = true;

export async function load() {
    throw redirect(307, '/nullclaw/docs/getting-started');
}
```

`src/routes/nullclaw/docs/[slug]/+page.ts`:
```typescript
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const pages = import.meta.glob('/src/lib/docs/nullclaw/*.md', { query: '?raw', import: 'default' });
    const path = `/src/lib/docs/nullclaw/${params.slug}.md`;

    if (!pages[path]) {
        throw error(404, 'Documentation page not found');
    }

    const content = await pages[path]();
    return { content: content as string };
}
```

`src/routes/nullclaw/docs/[slug]/+page.svelte`:
```svelte
<script lang="ts">
  import { page } from "$app/stores";
  import { renderMarkdown } from "$lib/markdown";

  let { data } = $props();
  let content = $derived(renderMarkdown(data.content));
</script>

<svelte:head>
  <title>NullClaw | {$page.params.slug}</title>
</svelte:head>

<div class="prose">
  {@html content}
</div>
```

**Step 4: Move existing getting-started.md into nullclaw folder**

```bash
mkdir -p src/lib/docs/nullclaw
mv src/lib/docs/getting-started.md src/lib/docs/nullclaw/getting-started.md
```

**Step 5: Verify it builds and the page loads**

Run: `npm run build`
Expected: Build succeeds. The route `/nullclaw/docs/getting-started` is prerendered.

**Step 6: Commit**

```bash
git add src/routes/nullclaw/ src/lib/docs/nullclaw/
git commit -m "feat: add nullclaw docs routes with multi-project structure"
```

---

### Task 6: Create chat-ui docs routes

**Files:**
- Create: `src/routes/chat-ui/+page.svelte` (placeholder)
- Create: `src/routes/chat-ui/docs/+layout.svelte`
- Create: `src/routes/chat-ui/docs/+page.server.ts`
- Create: `src/routes/chat-ui/docs/[slug]/+page.svelte`
- Create: `src/routes/chat-ui/docs/[slug]/+page.ts`
- Create: `src/lib/docs/chat-ui/` directory

**Step 1: Create chat-ui routes**

Same pattern as Task 5, but with chat-ui sidebar config and paths.

`src/routes/chat-ui/+page.svelte`:
```svelte
<svelte:head>
  <title>NullClaw Chat UI | Frontend Client</title>
</svelte:head>

<div style="padding: 80px 40px; text-align: center;">
  <h1>NullClaw Chat UI</h1>
  <p style="color: var(--fg-dim); margin-top: 20px;">Project landing — coming in Phase 2</p>
  <a href="/chat-ui/docs/overview" style="color: var(--accent); margin-top: 20px; display: inline-block;">Go to docs &rarr;</a>
</div>
```

`src/routes/chat-ui/docs/+layout.svelte`:
```svelte
<script lang="ts">
  import DocsLayout from "$lib/components/DocsLayout.svelte";

  let { children, data } = $props();

  const sections = [
    {
      title: "Overview",
      items: [
        { label: "Overview", href: "/chat-ui/docs/overview" },
        { label: "Architecture", href: "/chat-ui/docs/architecture" },
      ],
    },
    {
      title: "Protocol",
      items: [
        { label: "WebChannel v1", href: "/chat-ui/docs/protocol" },
      ],
    },
    {
      title: "Development",
      items: [
        { label: "Development", href: "/chat-ui/docs/development" },
        { label: "Deployment", href: "/chat-ui/docs/deployment" },
        { label: "Theming", href: "/chat-ui/docs/theming" },
      ],
    },
  ];
</script>

<DocsLayout sidebarTitle="CHAT UI DOCS" {sections} tocContent={data?.content ?? ""}>
  {@render children()}
</DocsLayout>
```

`src/routes/chat-ui/docs/+page.server.ts`:
```typescript
import { redirect } from '@sveltejs/kit';

export const prerender = true;

export async function load() {
    throw redirect(307, '/chat-ui/docs/overview');
}
```

`src/routes/chat-ui/docs/[slug]/+page.ts`:
```typescript
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const pages = import.meta.glob('/src/lib/docs/chat-ui/*.md', { query: '?raw', import: 'default' });
    const path = `/src/lib/docs/chat-ui/${params.slug}.md`;

    if (!pages[path]) {
        throw error(404, 'Documentation page not found');
    }

    const content = await pages[path]();
    return { content: content as string };
}
```

`src/routes/chat-ui/docs/[slug]/+page.svelte`:
```svelte
<script lang="ts">
  import { page } from "$app/stores";
  import { renderMarkdown } from "$lib/markdown";

  let { data } = $props();
  let content = $derived(renderMarkdown(data.content));
</script>

<svelte:head>
  <title>Chat UI | {$page.params.slug}</title>
</svelte:head>

<div class="prose">
  {@html content}
</div>
```

**Step 2: Create a placeholder overview.md so the build works**

`src/lib/docs/chat-ui/overview.md`:
```markdown
# NullClaw Chat UI

Terminal-style web interface for NullClaw. Full content coming soon.
```

**Step 3: Verify it builds**

Run: `npm run build`
Expected: Build succeeds. Routes `/chat-ui/docs/overview` prerendered.

**Step 4: Commit**

```bash
git add src/routes/chat-ui/ src/lib/docs/chat-ui/
git commit -m "feat: add chat-ui docs routes"
```

---

### Task 7: Update navbar with product switcher

**Files:**
- Modify: `src/routes/+layout.svelte`

**Context:** Replace the simple nav links with a product-aware navigation. Add dropdown or direct links to each project's docs.

**Step 1: Update the nav-links section in `src/routes/+layout.svelte`**

Replace the existing `.nav-links` div content:

```svelte
<div class="nav-links">
  <a href="/">Home</a>
  <a href="/nullclaw/docs/getting-started">Nullclaw</a>
  <a href="/chat-ui/docs/overview">Chat UI</a>
</div>
```

Also update the GITHUB link to point to the org:
```svelte
<a href="https://github.com/nullclaw" target="_blank" class="github-btn">GITHUB</a>
```

**Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat: update navbar with per-project navigation links"
```

---

### Task 8: Update homepage with new links

**Files:**
- Modify: `src/routes/+page.svelte`

**Context:** Update project cards to link to new routes instead of old `/docs/getting-started` and `/ui`.

**Step 1: Update href values in project cards**

In `src/routes/+page.svelte`:
- NullClaw Agent card: change `href="/docs/getting-started"` → `href="/nullclaw"`
- NullClaw Chat UI card: change `href="/ui"` → `href="/chat-ui"`
- Orchestrator card: wrap in `<a href="/orchestrator">` (or keep as `<div>`)
- Tracker card: wrap in `<a href="/tracker">` (or keep as `<div>`)

**Step 2: Verify it builds**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: update homepage cards to use new project routes"
```

---

### Task 9: Create nullclaw project landing page

**Files:**
- Modify: `src/routes/nullclaw/+page.svelte`

**Context:** Replace placeholder with a proper project landing. Similar structure to the old `/ui` page but for nullclaw core: hero, feature highlights, benchmarks, quick links.

**Step 1: Write the full landing page**

Reference the existing `src/routes/ui/+page.svelte` for style patterns (breadcrumb, hero, feature cards, code block). Adapt for nullclaw core content:

- **Breadcrumb**: `NULLCLAW ECOSYSTEM / NULLCLAW`
- **Title**: `NULLCLAW`
- **Subtitle** (typewriter): "Fastest, smallest, and fully autonomous AI assistant infrastructure written in Zig."
- **Badges**: `678 KB binary`, `<2ms startup`, `~1MB RAM`, `3,230+ tests`
- **Actions**: "Get Started →" linking to `/nullclaw/docs/getting-started`, "View on GitHub" linking to repo
- **Feature cards** (3-4):
  - `[ PROVIDERS ]` — 22+ AI providers
  - `[ CHANNELS ]` — 19 messaging channels
  - `[ MEMORY ]` — Hybrid vector + FTS5 search
  - `[ SECURITY ]` — Multi-layer sandbox + encryption
- **Quick install code block**:
  ```bash
  git clone https://github.com/nullclaw/nullclaw.git
  cd nullclaw && zig build
  ./zig-out/bin/nullclaw onboard --interactive
  ```

Reuse CSS patterns from `src/routes/ui/+page.svelte` (`.header`, `.container`, `.feature-card`, `.code-block`, etc).

**Step 2: Verify it builds and visually check**

Run: `npm run dev` and navigate to `http://localhost:5173/nullclaw`
Expected: Landing page renders with hero, features, code block.

**Step 3: Commit**

```bash
git add src/routes/nullclaw/+page.svelte
git commit -m "feat: add nullclaw project landing page"
```

---

### Task 10: Write nullclaw getting-started.md

**Files:**
- Modify: `src/lib/docs/nullclaw/getting-started.md`

**Context:** Rewrite the getting started page. The current file is a copy of the README with HTML badges. Replace with clean markdown focused on getting users up and running.

**Content outline (source: README.md + source analysis):**

```markdown
# Getting Started

## What is NullClaw?

[2-3 sentence overview. 678 KB binary, <2ms startup, 22+ providers, 19 channels]

## Requirements

- Zig 0.15.2 (exact version required)
- Git

## Installation

[git clone, zig build commands]

## Quick Start

### Option 1: Quick onboard
[nullclaw onboard --api-key ... --provider ...]

### Option 2: Interactive setup
[nullclaw onboard --interactive]

### Your first message
[nullclaw agent -m "Hello!"]

### Interactive chat
[nullclaw agent]

### Start the gateway
[nullclaw gateway]

## Verify Installation

[nullclaw doctor, nullclaw status]

## Next Steps

[Links to: Configuration, Providers, Channels, CLI reference]
```

**Source data:** `/Users/igorsomov/Code/nullclaw/README.md` — extract Quick Start, Commands sections.

**Step 1: Write the content**

**Step 2: Verify it builds and renders**

Run: `npm run build`
Navigate to `/nullclaw/docs/getting-started` in dev mode to verify rendering.

**Step 3: Commit**

```bash
git add src/lib/docs/nullclaw/getting-started.md
git commit -m "docs: rewrite nullclaw getting started guide"
```

---

### Task 11: Write nullclaw architecture.md

**Files:**
- Create: `src/lib/docs/nullclaw/architecture.md`

**Content outline (source: README.md architecture section + AGENTS.md + source tree):**

```markdown
# Architecture

## Overview

[Vtable-driven, modular design. All extension points explicit and swappable.]

## Module Map

[Diagram showing: main.zig → agent/gateway → channels, providers, tools, memory, security]

## Core Modules

### Agent Loop (`src/agent.zig`)
[Orchestrates conversation: provider call → tool execution → response]

### Gateway (`src/gateway.zig`)
[HTTP server, multi-channel runtime, heartbeat]

### Channel Manager (`src/channel_manager.zig`)
[Manages channel lifecycle, message routing]

## Vtable Contract

[How interfaces work: Provider.VTable, Channel.VTable, Tool.VTable, Memory]
[Code example of implementing a vtable]

## Extension Points

[Table: Interface → File → How to extend]
- Provider: src/providers/root.zig → implement VTable → register in factory
- Channel: src/channels/root.zig → implement VTable → register in factory
- Tool: src/tools/root.zig → implement VTable → register in factory
- Memory: src/memory/root.zig → implement Memory struct → register in registry
- Sandbox, Observer, Runtime, Tunnel

## Data Flow

[Message lifecycle: Channel receives → Session → Agent loop → Provider → Tools → Response → Channel]
```

**Source data:** `/Users/igorsomov/Code/nullclaw/AGENTS.md`, `/Users/igorsomov/Code/nullclaw/README.md`

**Step 1: Write the content**
**Step 2: Verify build, commit**

```bash
git add src/lib/docs/nullclaw/architecture.md
git commit -m "docs: add nullclaw architecture documentation"
```

---

### Task 12: Write nullclaw configuration.md

**Files:**
- Create: `src/lib/docs/nullclaw/configuration.md`

**Content outline (source: config.example.json + README.md):**

```markdown
# Configuration

## Config File Location

[~/.nullclaw/config.json, OpenClaw-compatible schema]

## Full Example

[Annotated config.example.json]

## Sections

### models.providers
[Per-provider: api_key, base_url examples for openrouter, anthropic, groq, ollama]

### agents
[defaults.model, defaults.heartbeat, agent list with custom system prompts]

### channels
[Overview of channel config structure, link to Channels page for details]

### memory
[backend, embedding_provider, vector_weight, keyword_weight, search, lifecycle]

### gateway
[port, host, require_pairing]

### autonomy
[level, workspace_only, max_actions_per_hour, allowed_commands, allowed_paths]

### security
[sandbox.backend, audit.enabled, audit.retention_days]

### runtime
[kind: native|docker|wasm]

### tunnel
[provider: none|cloudflare|tailscale|ngrok]

## Secret Encryption

[enc2: prefix, ChaCha20-Poly1305, how to encrypt secrets]

## Build-Time Options

[-Dchannels, -Doptimize, -Dtarget, -Dsqlite/-Dpostgres/-Dredis]
```

**Source data:** `/Users/igorsomov/Code/nullclaw/config.example.json`

**Step 1: Write the content**
**Step 2: Verify build, commit**

```bash
git add src/lib/docs/nullclaw/configuration.md
git commit -m "docs: add nullclaw configuration reference"
```

---

### Task 13: Write nullclaw providers.md

**Files:**
- Create: `src/lib/docs/nullclaw/providers.md`

**Content outline (source: src/providers/ directory + README.md):**

```markdown
# Providers

## Overview

[22+ AI providers via vtable interface. Hot-swappable, no lock-in.]

## Supported Providers

| Provider | Module | Config Key | Notes |
|----------|--------|------------|-------|
| Anthropic Claude | anthropic.zig | anthropic | Claude 3/4 models |
| OpenAI | openai.zig | openai | GPT-4o, o1, etc |
| Google Gemini | gemini.zig | gemini | Gemini Pro/Flash |
| Ollama | ollama.zig | ollama | Local models |
| OpenRouter | openrouter.zig | openrouter | Aggregator |
| ... | ... | ... | ... |

## Configuration

### API Key Setup
[Per-provider examples]

### OpenAI-Compatible Endpoints
[How to use compatible.zig with custom base_url]

### Model Selection
[agents.defaults.model format: "provider/model-name"]

## Fallback & Reliability

[reliable.zig: retries, provider fallback chains]
[reliability config section]

## Adding a Custom Provider

[Implement Provider.VTable, register in factory — link to Architecture]
```

**Source data:** `/Users/igorsomov/Code/nullclaw/src/providers/` file listing, README providers section.

**Step 1: Write the content**
**Step 2: Verify build, commit**

```bash
git add src/lib/docs/nullclaw/providers.md
git commit -m "docs: add nullclaw providers documentation"
```

---

### Task 14: Write nullclaw channels.md

**Files:**
- Create: `src/lib/docs/nullclaw/channels.md`

**Content outline (source: src/channels/ directory + README.md + config.example.json):**

```markdown
# Channels

## Overview

[19 messaging channels. Each channel = vtable implementation.]

## Channel Matrix

| Channel | Module | Protocol | Status |
|---------|--------|----------|--------|
| CLI | cli.zig | stdin/stdout | Stable |
| Telegram | telegram.zig | Bot API | Stable |
| Discord | discord.zig | Gateway v10 | Stable |
| Slack | slack.zig | Socket Mode | Stable |
| Signal | signal.zig | Signal Protocol | Stable |
| Nostr | nostr.zig | NIP-17/NIP-04 | Stable |
| Matrix | matrix.zig | CS API | Stable |
| IRC | irc.zig | IRC v3 | Stable |
| ... | ... | ... | ... |

## Configuration

### Telegram
[bot_token, allow_from, webhook vs polling]

### Discord
[token, guild_id, allow_bots, intents]

### Nostr
[private_key (enc2:), owner_pubkey, relays]

### IRC
[Multiple accounts, nick, server config]

### Web (WebSocket)
[transport: local|relay, auth_token — connects to Chat UI]

### [Each remaining channel with config example]

## Allowlists & DM Policy

[allow_from patterns, allow_bots, DM vs group behavior]

## Channel Health

[nullclaw channel status command]

## Adding a Custom Channel

[Implement Channel.VTable — link to Architecture]
```

**Source data:** `/Users/igorsomov/Code/nullclaw/src/channels/` file listing, config.example.json channels section.

**Step 1: Write the content**
**Step 2: Verify build, commit**

```bash
git add src/lib/docs/nullclaw/channels.md
git commit -m "docs: add nullclaw channels documentation"
```

---

### Task 15: Write nullclaw tools.md

**Files:**
- Create: `src/lib/docs/nullclaw/tools.md`

**Content outline (source: src/tools/ directory):**

```markdown
# Tools

## Overview

[30+ built-in tools. Exposed to AI model via function calling.]

## Tool Categories

### File Operations
| Tool | Description |
|------|-------------|
| file_read | Read file contents |
| file_write | Write/create files |
| file_edit | Apply diff-based edits |

### Shell
| Tool | Description |
|------|-------------|
| shell | Execute shell commands (sandboxed) |

### Network
| Tool | Description |
|------|-------------|
| http_request | Make HTTP/HTTPS requests |
| web_search | Search the web (9 providers) |
| browser_open | Open URLs in browser |

### Git
| Tool | Description |
|------|-------------|
| git | Git operations (status, diff, commit, etc) |

### Memory
| Tool | Description |
|------|-------------|
| memory_store | Store information |
| memory_recall | Retrieve information (hybrid search) |
| memory_list | List stored memories |
| memory_forget | Delete memories |

### Scheduling
| Tool | Description |
|------|-------------|
| cron_add | Schedule recurring tasks |
| cron_list | List scheduled tasks |
| cron_remove | Remove scheduled tasks |

### Hardware
| Tool | Description |
|------|-------------|
| hardware_info | System hardware info |
| spi | SPI interface (RPi, Arduino) |

### Integrations
| Tool | Description |
|------|-------------|
| composio | Composio integrations |
| message | Send messages across channels |
| pushover | Push notifications |

## Web Search Providers

[Table: Brave, DuckDuckGo, Tavily, Firecrawl, Perplexity, Exa, Jina, SearXNG]
[Config: memory.search.provider]

## Security Scope

[workspace_only: tools restricted to workspace directory]
[Sandbox: shell commands run inside sandbox]
```

**Source data:** `/Users/igorsomov/Code/nullclaw/src/tools/` file listing.

**Step 1: Write the content**
**Step 2: Verify build, commit**

```bash
git add src/lib/docs/nullclaw/tools.md
git commit -m "docs: add nullclaw tools documentation"
```

---

### Task 16: Write nullclaw memory.md

**Files:**
- Create: `src/lib/docs/nullclaw/memory.md`

**Content outline (source: src/memory/ directory + config.example.json):**

```markdown
# Memory System

## Overview

[Hybrid vector + FTS5 search. Multiple backends. Zero external deps for default SQLite.]

## Backends

| Backend | Module | External Deps | Best For |
|---------|--------|--------------|----------|
| SQLite | sqlite.zig | None (vendored) | Default, production |
| Markdown | markdown.zig | None | Simple, file-based |
| Redis | redis.zig | Redis server | Distributed |
| PostgreSQL | postgres.zig | PostgreSQL | Existing infra |
| LanceDB | lancedb.zig | LanceDB | Large-scale vector |
| API | api.zig | Remote service | Cloud-hosted |
| In-Memory LRU | memory_lru.zig | None | Testing, ephemeral |

## Hybrid Search

[How FTS5 + vector cosine similarity work together]
[vector_weight, keyword_weight configuration]

## Embedding Providers

[OpenAI, Gemini, Voyage, Ollama — for vector embeddings]
[Config: memory.embedding_provider]

## Retrieval Strategies

[RRF (Reciprocal Rank Fusion), MMR (Max Marginal Relevance)]
[Query expansion, LLM reranking, adaptive retrieval, temporal decay]

## Memory Lifecycle

[Auto-archival, purge, snapshot]
[Lifecycle/hygiene settings in config]

## Memory Tools

[memory_store, memory_recall, memory_list, memory_forget — link to Tools]

## Migration

[nullclaw migrate openclaw command]
```

**Source data:** `/Users/igorsomov/Code/nullclaw/src/memory/` directory structure, config.example.json memory section.

**Step 1: Write the content**
**Step 2: Verify build, commit**

```bash
git add src/lib/docs/nullclaw/memory.md
git commit -m "docs: add nullclaw memory system documentation"
```

---

### Task 17: Write nullclaw security.md

**Files:**
- Create: `src/lib/docs/nullclaw/security.md`

**Content outline (source: src/security/ directory + README.md):**

```markdown
# Security

## Overview

[Multi-layer security: pairing, encryption, sandbox, audit, allowlists]

## Pairing

[6-digit one-time code on startup]
[gateway.require_pairing config]

## Secret Encryption

[ChaCha20-Poly1305 symmetric encryption]
[enc2: prefix in config values]
[How to encrypt: nullclaw onboard encrypts automatically]

## Sandbox

| Backend | Module | Platform | Notes |
|---------|--------|----------|-------|
| Landlock | landlock.zig | Linux 5.13+ | Kernel-level filesystem restriction |
| Firejail | firejail.zig | Linux | Process sandboxing |
| Bubblewrap | bubblewrap.zig | Linux | Unprivileged container |
| Docker | docker.zig | Any | Container isolation |
| Auto-detect | detect.zig | Any | Picks best available |

[Config: security.sandbox.backend = "auto"]

## Filesystem Scoping

[autonomy.workspace_only: restrict to workspace directory]
[Symlink escape detection, null byte injection blocked]

## Allowlists

[Channel-level: allow_from, allow_bots, DM policy]

## Audit Logging

[security.audit.enabled, retention_days]
[Signed event trail]

## Access Policy

[policy.zig: declarative access rules]
```

**Source data:** `/Users/igorsomov/Code/nullclaw/src/security/` directory, README Security section.

**Step 1: Write the content**
**Step 2: Verify build, commit**

```bash
git add src/lib/docs/nullclaw/security.md
git commit -m "docs: add nullclaw security documentation"
```

---

### Task 18: Write nullclaw cli.md

**Files:**
- Create: `src/lib/docs/nullclaw/cli.md`

**Content outline (source: src/main.zig commands enum + README.md):**

```markdown
# CLI Reference

## Usage

[nullclaw <command> [options]]

## Commands

### agent
[Run the AI agent]
- `nullclaw agent` — interactive chat
- `nullclaw agent -m "message"` — single message

### gateway
[Start the multi-channel gateway]
- `nullclaw gateway --port 8080 --host 0.0.0.0`
- Options: --port/-p, --host

### onboard
[Setup wizard]
- `nullclaw onboard --api-key <key> --provider <name>` — quick setup
- `nullclaw onboard --interactive` — full wizard
- `nullclaw onboard --channels-only` — channel setup only

### service
[Background service management]
- `nullclaw service install|start|stop|status|uninstall`

### status
[System status overview]

### doctor
[System diagnostics and health check]

### channel
[Channel management]
- `nullclaw channel status` — show channel health

### cron
[Task scheduling]
- `nullclaw cron list|add|remove`

### memory
[Memory management commands]

### skills
[Skill pack management]

### hardware
[Hardware info and peripheral status]

### models
[List available models]

### migrate
[Migrate from other systems]
- `nullclaw migrate openclaw [--dry-run]`

### auth
[Authentication management]

### workspace
[Workspace management]

### capabilities
[Show system capabilities]

### update
[Check for updates]

### version
[Show version]
- Also: `nullclaw --version`, `nullclaw -V`

### help
[Show help]
- Also: `nullclaw --help`, `nullclaw -h`
```

**Source data:** `/Users/igorsomov/Code/nullclaw/src/main.zig` command enum, README Commands table.

**Step 1: Write the content**
**Step 2: Verify build, commit**

```bash
git add src/lib/docs/nullclaw/cli.md
git commit -m "docs: add nullclaw CLI reference"
```

---

### Task 19: Create placeholder pages for orchestrator and tracker

**Files:**
- Create: `src/routes/orchestrator/+page.svelte`
- Create: `src/routes/tracker/+page.svelte`

**Step 1: Create coming-soon pages**

Both pages follow the same template — a styled "Coming Soon" page consistent with the cyberpunk theme:

```svelte
<svelte:head>
  <title>NullClaw | Agent Orchestrator</title>
</svelte:head>

<div class="coming-soon">
  <div class="content">
    <div class="status-badge">[ IN DEVELOPMENT ]</div>
    <h1>AGENT ORCHESTRATOR</h1>
    <p>Multi-agent coordination and distribution system for complex distributed reasoning.</p>
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
  }
  p {
    color: var(--fg-dim);
    line-height: 1.6;
    margin-bottom: 40px;
  }
  .terminal-line {
    color: var(--warning);
    margin-bottom: 40px;
  }
  .cursor {
    animation: blinkCursor 1s infinite;
  }
  .back-link {
    color: var(--accent);
    text-decoration: none;
    font-size: 0.9rem;
  }
  .back-link:hover { text-shadow: var(--text-glow); }
</style>
```

Create similar for tracker with title "AI TASK TRACKER" and description "Autonomous issue resolution and board management interface engineered for AI agents."

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/routes/orchestrator/ src/routes/tracker/
git commit -m "feat: add coming-soon pages for orchestrator and tracker"
```

---

### Task 20: Remove old routes and verify Phase 1

**Files:**
- Delete: `src/routes/ui/+page.svelte`
- Delete: `src/routes/docs/+layout.svelte`
- Delete: `src/routes/docs/+page.server.ts`
- Delete: `src/routes/docs/[slug]/+page.svelte`
- Delete: `src/routes/docs/[slug]/+page.ts`

**Step 1: Remove old routes**

```bash
rm -rf src/routes/ui src/routes/docs
```

**Step 2: Update prerender config if needed**

Check `svelte.config.js` — the `entries: ['*']` glob should auto-discover new routes. No changes needed.

**Step 3: Full build verification**

Run: `npm run build`
Expected: Build succeeds with all new routes prerendered. No 404 warnings for old routes.

Run: `npm run check`
Expected: No TypeScript or Svelte errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old /docs and /ui routes, complete Phase 1 restructure"
```

---

## Phase 2: Chat UI Docs + Polish

### Task 21: Write chat-ui overview.md

**Files:**
- Modify: `src/lib/docs/chat-ui/overview.md`

**Content (source: /Users/igorsomov/Code/nullclaw-ui/README.md):**

```markdown
# NullClaw Chat UI

## What is it?

[Terminal-style web interface for NullClaw agent. Real-time streaming, E2E encryption, tool call rendering.]

## Key Features

- PIN-based pairing with 6-digit code
- End-to-end encryption (X25519 + ChaCha20-Poly1305)
- Real-time streaming assistant responses
- Tool call timeline with syntax highlighting
- Approval flow for sensitive operations
- Session persistence with token TTL
- 5 cyberpunk themes (Matrix, Dracula, Synthwave, Amber, Light)
- CRT effects (scanlines, glow, glitch)

## Tech Stack

- Svelte 5 (runes API)
- SvelteKit 2 (static adapter)
- TypeScript 5.9
- Vite 7

## Quick Start

[npm install, npm run dev, open localhost:5173]
[Connect to running nullclaw gateway]

## Screenshots / UI Description

[Describe the terminal UI, pairing screen, chat screen, tool calls, approval prompts]
```

**Source data:** `/Users/igorsomov/Code/nullclaw-ui/README.md`

**Step 1: Write, build, commit**

```bash
git add src/lib/docs/chat-ui/overview.md
git commit -m "docs: write chat-ui overview page"
```

---

### Task 22: Write chat-ui architecture.md

**Files:**
- Create: `src/lib/docs/chat-ui/architecture.md`

**Content (source: /Users/igorsomov/Code/nullclaw-ui/docs/architecture.md):**

Adapt the existing architecture.md from the chat-ui repo. Convert to documentation-site friendly format:

```markdown
# Architecture

## Layered Design

[5 layers: Presentation → Orchestration → Domain → Transport → Persistence]

## Presentation Layer
[Components: ChatScreen, PairingScreen, MessageBubble, ToolCallBlock, ApprovalPrompt, StatusBar]

## Application Orchestration
[connection-controller.svelte.ts: manages NullclawClient lifecycle]
[APIs: connectWithPairing(), restoreSavedSession(), sendMessage(), sendApproval(), logout()]

## Domain State
[session.svelte.ts: timeline store for messages, tool calls, approvals, errors]

## Transport + Protocol
[client.svelte.ts: WebSocket lifecycle, envelope parsing, reconnect]

## Persistence
[auth-storage.ts: localStorage management for auth tokens]
[preferences.ts: theme and effects persistence]

## Client State Machine

[disconnected → connecting → pairing → paired → chatting]

## Key Invariants

[From architecture.md: components don't own WS, only controller writes auth, etc]
```

**Source data:** `/Users/igorsomov/Code/nullclaw-ui/docs/architecture.md`

**Step 1: Write, build, commit**

```bash
git add src/lib/docs/chat-ui/architecture.md
git commit -m "docs: write chat-ui architecture page"
```

---

### Task 23: Write chat-ui protocol.md

**Files:**
- Create: `src/lib/docs/chat-ui/protocol.md`

**Content (source: /Users/igorsomov/Code/nullclaw-ui/docs/protocol.md):**

```markdown
# WebChannel v1 Protocol

## Envelope Format
[JSON: v, type, session_id, agent_id, request_id, payload]

## Events

### UI → Core
- pairing_request
- user_message
- approval_response

### Core → UI
- pairing_result
- assistant_chunk
- assistant_final
- tool_call
- tool_result
- approval_request
- error

## Pairing Flow
[Step-by-step: open WS → generate X25519 keys → send 6-digit PIN → receive token + agent_pub → derive shared key]

## E2E Encryption
[X25519 key exchange → SHA-256 key derivation → ChaCha20-Poly1305 symmetric]
[Payload format: { nonce, ciphertext } as base64url]

## Error Handling
[code: "unauthorized" → clear auth → logout]

## Reconnection Policy
[Exponential backoff: 1s base, 30s max, 50-100% jitter]
```

**Source data:** `/Users/igorsomov/Code/nullclaw-ui/docs/protocol.md`

**Step 1: Write, build, commit**

```bash
git add src/lib/docs/chat-ui/protocol.md
git commit -m "docs: write chat-ui WebChannel protocol page"
```

---

### Task 24: Write chat-ui development.md

**Files:**
- Create: `src/lib/docs/chat-ui/development.md`

**Content (source: /Users/igorsomov/Code/nullclaw-ui/docs/development.md + testing.md):**

Merge development + testing docs into one page:

```markdown
# Development Guide

## Prerequisites
[Node.js 20+, npm 10+]

## Setup
[git clone, npm install, npm run dev]

## Project Structure
[Key directories and files]

## Code Conventions
[Svelte 5 runes, thin components, isolated transport, payload validation]

## Testing
[Vitest + jsdom + @testing-library/svelte]
[npm run test, npm run test:watch]
[Current coverage areas]
[Testing principles]

## Adding Features
[Layer-by-layer approach: transport → domain → presentation]

## Debugging
[Tips from development.md]
```

**Source data:** `/Users/igorsomov/Code/nullclaw-ui/docs/development.md`, `/Users/igorsomov/Code/nullclaw-ui/docs/testing.md`

**Step 1: Write, build, commit**

```bash
git add src/lib/docs/chat-ui/development.md
git commit -m "docs: write chat-ui development guide"
```

---

### Task 25: Write chat-ui deployment.md

**Files:**
- Create: `src/lib/docs/chat-ui/deployment.md`

**Content (source: /Users/igorsomov/Code/nullclaw-ui/docs/operations.md):**

```markdown
# Deployment

## Build
[npm run build → static output in build/]

## Hosting
[Static hosting: GitHub Pages, Cloudflare Pages, Nginx, any CDN]
[Must serve index.html as fallback for SPA routing]

## Runtime Configuration
[User enters WebSocket endpoint in UI — no env vars needed]
[Backend must be running nullclaw gateway]

## Sensitive Data
[Auth tokens in localStorage with TTL]
[E2E encryption keys]

## Release Checklist
[From operations.md]

## Troubleshooting
[Common issues and solutions]
```

**Source data:** `/Users/igorsomov/Code/nullclaw-ui/docs/operations.md`

**Step 1: Write, build, commit**

```bash
git add src/lib/docs/chat-ui/deployment.md
git commit -m "docs: write chat-ui deployment guide"
```

---

### Task 26: Write chat-ui theming.md

**Files:**
- Create: `src/lib/docs/chat-ui/theming.md`

**Content (source: src/app.css themes + chat-ui theme.ts + preferences.ts):**

```markdown
# Theming

## Built-in Themes

| Theme | Accent | Background | Vibe |
|-------|--------|------------|------|
| Matrix (default) | #00ff41 green | Dark green | Classic terminal |
| Dracula | #bd93f9 purple | Dark gray | Popular dark theme |
| Synthwave | #ff00ff magenta | Dark purple | Retro neon |
| Amber | #ffb000 gold | Dark brown | Vintage terminal |
| Light | #00702a green | Light paper | Readable daylight |

## CSS Variables

[Full list of --bg, --fg, --accent, etc. variables]

## Creating a Custom Theme

[Add body.theme-{name} class with all CSS variables]
[Register in theme cycling array]

## Effects

[CRT scanlines, text glow, glitch animation]
[Toggle via CRT button or preferences]

## Persistence

[Theme saved to localStorage: nullclaw_ui_theme]
[Effects saved to: nullclaw_ui_effects]
```

**Source data:** `src/app.css` (current repo), `/Users/igorsomov/Code/nullclaw-ui/src/lib/theme.ts`

**Step 1: Write, build, commit**

```bash
git add src/lib/docs/chat-ui/theming.md
git commit -m "docs: write chat-ui theming guide"
```

---

### Task 27: Create chat-ui project landing page

**Files:**
- Modify: `src/routes/chat-ui/+page.svelte`

**Context:** Replace placeholder with proper landing. Reuse patterns from the old `/ui` page (`src/routes/ui/+page.svelte`) which had: breadcrumb, hero, feature cards, install code block.

**Step 1: Write the landing page**

Move/adapt the content from the old `src/routes/ui/+page.svelte` (which was already a nice landing for chat-ui) into the new route. Update links to point to `/chat-ui/docs/overview` instead of old paths.

Key changes from old `/ui`:
- Add "Get Started" button linking to `/chat-ui/docs/overview`
- Add more feature cards (E2E encryption, approval flow, session persistence)
- Keep the install code block

**Step 2: Verify build, commit**

```bash
git add src/routes/chat-ui/+page.svelte
git commit -m "feat: add chat-ui project landing page"
```

---

### Task 28: Add markdown styles to docs layout

**Files:**
- Modify: `src/lib/components/DocsLayout.svelte` (or keep in a shared location)

**Context:** The markdown body styles (`.markdown-body h1`, `.markdown-body h2`, code blocks, etc.) are currently in `src/routes/docs/+layout.svelte` which will be deleted. These global styles need to live somewhere that applies to all doc pages.

**Step 1: Move markdown styles**

Move the `:global(.markdown-body ...)` styles from the old docs layout into `src/lib/components/DocsLayout.svelte`'s `<style>` block (as `:global()` rules since they target rendered HTML content).

The styles to move:
- `.markdown-body h1, h2, h3` styling
- `.markdown-body p, li` styling
- `.markdown-body a` styling
- `.markdown-body ul, ol` styling
- `.markdown-body code`, `pre` styling
- `.markdown-body blockquote` styling

**Step 2: Verify build, check rendered docs**

Run: `npm run dev`
Navigate to `/nullclaw/docs/getting-started` — verify markdown renders correctly with proper styling.

**Step 3: Commit**

```bash
git add src/lib/components/DocsLayout.svelte
git commit -m "feat: move markdown styles to shared DocsLayout component"
```

**NOTE:** This task should actually be done during Task 4 or Task 5 to ensure markdown renders correctly from the start. Reorder accordingly during execution.

---

### Task 29: Final build and verification

**Step 1: Full build**

Run: `npm run build`
Expected: Clean build with all routes prerendered.

**Step 2: TypeScript check**

Run: `npm run check`
Expected: No errors.

**Step 3: Visual verification**

Run: `npm run preview`
Check all routes:
- `/` — Ecosystem hub with 4 project cards
- `/nullclaw` — Project landing
- `/nullclaw/docs/getting-started` — Full doc with ToC
- `/nullclaw/docs/architecture` — Renders correctly
- `/nullclaw/docs/configuration` — Config reference
- `/nullclaw/docs/providers` — Provider table
- `/nullclaw/docs/channels` — Channel matrix
- `/nullclaw/docs/tools` — Tools list
- `/nullclaw/docs/memory` — Memory system
- `/nullclaw/docs/security` — Security docs
- `/nullclaw/docs/cli` — CLI reference
- `/chat-ui` — Project landing
- `/chat-ui/docs/overview` — Overview page
- `/chat-ui/docs/architecture` — Architecture
- `/chat-ui/docs/protocol` — WebChannel protocol
- `/chat-ui/docs/development` — Dev guide
- `/chat-ui/docs/deployment` — Deployment
- `/chat-ui/docs/theming` — Theming guide
- `/orchestrator` — Coming soon
- `/tracker` — Coming soon

**Step 4: Check theme cycling and CRT toggle on doc pages**

**Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "chore: final polish and verification for documentation redesign"
```
