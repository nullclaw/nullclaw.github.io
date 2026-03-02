# Documentation Redesign — Design Document

**Date**: 2026-03-01
**Status**: Approved

## Goal

Restructure nullclaw.io from a single-project landing page into a multi-project documentation hub for the nullclaw ecosystem, with full documentation for nullclaw (core) and nullclaw-chat-ui.

## Decisions

- **Visual style**: Keep current cyberpunk theme (5 themes, CRT effects, JetBrains Mono)
- **Navigation**: Multi-project routing — each project gets its own route prefix
- **Content scope**: Full documentation for both projects (9 pages core + 6 pages chat-ui)
- **UX features**: Table of Contents, improved sidebar with nested sections, project landing pages, navbar product switcher

## Architecture

### URL Structure

```
/                           → Ecosystem hub (hero + project cards)
/nullclaw                   → Nullclaw project landing
/nullclaw/docs/[slug]       → Nullclaw documentation pages
/chat-ui                    → Chat UI project landing
/chat-ui/docs/[slug]        → Chat UI documentation pages
/orchestrator               → Coming soon placeholder
/tracker                    → Coming soon placeholder
```

### Route Layout

```
src/routes/
├── +layout.svelte              # Root: navbar, footer, theme toggle
├── +layout.js                  # Prerender config
├── +page.svelte                # Ecosystem hub
├── nullclaw/
│   ├── +page.svelte            # Project landing
│   └── docs/
│       ├── +layout.svelte      # Nullclaw docs sidebar
│       ├── +page.server.ts     # Redirect → getting-started
│       └── [slug]/
│           ├── +page.svelte    # Markdown renderer
│           └── +page.ts        # Loads from src/lib/docs/nullclaw/
├── chat-ui/
│   ├── +page.svelte            # Project landing
│   └── docs/
│       ├── +layout.svelte      # Chat UI docs sidebar
│       ├── +page.server.ts     # Redirect → overview
│       └── [slug]/
│           ├── +page.svelte    # Markdown renderer
│           └── +page.ts        # Loads from src/lib/docs/chat-ui/
├── orchestrator/
│   └── +page.svelte            # Coming soon
└── tracker/
    └── +page.svelte            # Coming soon
```

### Markdown Content

```
src/lib/docs/
├── nullclaw/
│   ├── getting-started.md      # Quick start guide
│   ├── architecture.md         # Vtable architecture, modules, data flow
│   ├── configuration.md        # Full config.json reference + build options
│   ├── providers.md            # 22+ AI provider setup guides
│   ├── channels.md             # 19 channel configs (Telegram, Discord, Nostr...)
│   ├── tools.md                # 30+ tools categorized
│   ├── memory.md               # Hybrid memory system, backends, retrieval
│   ├── security.md             # Pairing, encryption, sandbox, audit
│   └── cli.md                  # 20+ CLI commands reference
└── chat-ui/
    ├── overview.md             # What it is, features, screenshots
    ├── architecture.md         # 5-layer architecture, state machine
    ├── protocol.md             # WebChannel v1, events, E2E encryption
    ├── development.md          # Dev setup, conventions, testing
    ├── deployment.md           # Build, hosting, troubleshooting
    └── theming.md              # 5 themes, CSS variables, custom themes
```

## UX Improvements

### Table of Contents (ToC)
- Auto-generated from markdown H2/H3 headings
- Displayed on right side panel on wide screens
- Highlights current section on scroll
- Collapses on narrow screens

### Improved Sidebar
- Grouped sections with headers (e.g., "Core", "Components", "Reference")
- Active link highlighting
- Per-project independent sidebar config

### Project Landing Pages
- Hero section with project description and badges
- Feature highlights grid
- Quick links to key docs
- GitHub repository link

### Navbar Enhancement
- Product switcher dropdown (Nullclaw, Chat UI, Orchestrator, Tracker)
- Links to GitHub org

## Content Sources

- **nullclaw docs**: Based on README.md (22KB), AGENTS.md (13KB), config.example.json, source code analysis
- **chat-ui docs**: Based on existing docs/ folder (architecture.md, protocol.md, development.md, testing.md, operations.md)

## Phases

### Phase 1: Site restructure + nullclaw docs
1. Restructure routes (multi-project layout)
2. Create shared doc components (ToC, sidebar, markdown renderer)
3. Update navbar with product switcher
4. Write all 9 nullclaw documentation pages
5. Create nullclaw project landing
6. Update homepage ecosystem hub
7. Create placeholder pages for orchestrator/tracker

### Phase 2: Chat UI docs + polish
1. Write all 6 chat-ui documentation pages
2. Create chat-ui project landing
3. Remove old /ui and /docs routes
4. Final testing and polish
