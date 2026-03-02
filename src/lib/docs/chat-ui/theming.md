# Theming

NullClaw Chat UI ships with 5 built-in themes and optional CRT visual effects. Themes are applied via CSS custom properties on `<body>`, and preferences are persisted in `localStorage`.

## Built-in Themes

### Matrix (Default)

The classic green-on-black terminal look. Bright green text with a subtle glow, evoking the feel of legacy CRT monitors.

**Body class:** `theme-matrix`

### Dracula

A popular dark theme with soft purple accents and warm tones. Easy on the eyes for long sessions.

**Body class:** `theme-dracula`

### Synthwave

Neon cyan and magenta on a deep purple background. Inspired by retro-futuristic aesthetics.

**Body class:** `theme-synthwave`

### Amber

Warm amber/orange on dark brown. Replicates the look of vintage amber-phosphor CRT displays.

**Body class:** `theme-amber`

### Light

A light-background theme for daylight readability. Vintage paper-terminal aesthetic with dark text and green accents.

**Body class:** `theme-light`

## CSS Variables Reference

Every theme defines the same set of CSS custom properties. Override these to customize any theme or create your own.

| Variable | Purpose | Matrix | Dracula | Synthwave | Amber | Light |
|---|---|---|---|---|---|---|
| `--bg` | Page background | `#030a05` | `#282a36` | `#1a0b2e` | `#1c0f00` | `#e4e2de` |
| `--bg-surface` | Card/panel background | `rgba(0,20,5,0.7)` | `rgba(40,42,54,0.85)` | `rgba(26,11,46,0.85)` | `rgba(28,15,0,0.85)` | `rgba(255,255,255,0.6)` |
| `--bg-hover` | Hover state background | `rgba(0,40,10,0.8)` | `rgba(68,71,90,0.8)` | `rgba(54,23,94,0.8)` | `rgba(66,32,0,0.8)` | `rgba(220,218,214,0.8)` |
| `--fg` | Primary text color | `#00ff41` | `#f8f8f2` | `#00ffff` | `#ffb000` | `#2b2b2b` |
| `--fg-dim` | Secondary/muted text | `#00aa2a` | `#bbbbbb` | `#36c5c5` | `#cc8d00` | `#5c5c5c` |
| `--accent` | Primary accent color | `#00ff41` | `#bd93f9` | `#ff00ff` | `#ffb000` | `#00702a` |
| `--accent-dim` | Muted accent | `#008822` | `#ff79c6` | `#b500b5` | `#b37b00` | `#004b1c` |
| `--error` | Error state color | `#ff2a2a` | `#ff5555` | `#ff3366` | `#ff4400` | `#cf222e` |
| `--warning` | Warning state color | `#ffaa00` | `#f1fa8c` | `#f7e018` | `#ffea00` | `#9a6700` |
| `--border` | Border color | `rgba(0,255,65,0.3)` | `rgba(189,147,249,0.4)` | `rgba(255,0,255,0.4)` | `rgba(255,176,0,0.35)` | `rgba(0,0,0,0.15)` |
| `--border-glow` | Glow on focus/hover | `rgba(0,255,65,0.5)` | `rgba(189,147,249,0.6)` | `rgba(255,0,255,0.6)` | `rgba(255,176,0,0.55)` | `rgba(0,112,42,0.2)` |
| `--text-glow` | Text shadow glow | `0 0 5px rgba(0,255,65,0.4)` | `0 0 5px rgba(189,147,249,0.3)` | `0 0 6px rgba(255,0,255,0.5)` | `0 0 5px rgba(255,176,0,0.4)` | `none` |
| `--font-mono` | Monospace font stack | `'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace` | *(inherited)* | *(inherited)* | *(inherited)* | *(inherited)* |

## How to Add a Custom Theme

### Step 1: Define the CSS Variables

Add a new body class with your theme's variables in your CSS:

```css
body.theme-cyberpunk {
  --bg: #0d0221;
  --bg-surface: rgba(13, 2, 33, 0.85);
  --bg-hover: rgba(38, 8, 82, 0.8);
  --fg: #0abdc6;
  --fg-dim: #078a8f;
  --accent: #ea00d9;
  --accent-dim: #a200a3;
  --error: #ff003c;
  --warning: #ffd300;
  --border: rgba(10, 189, 198, 0.4);
  --border-glow: rgba(10, 189, 198, 0.6);
  --text-glow: 0 0 5px rgba(10, 189, 198, 0.4);
}
```

### Step 2: Register the Theme

In `src/lib/theme.ts`, add your theme to the supported list:

```typescript
export const SUPPORTED_THEMES = [
  'matrix', 'dracula', 'synthwave', 'amber', 'light',
  'cyberpunk'  // Add here
] as const;

export const THEME_OPTIONS: Array<{ value: ThemeName; label: string }> = [
  // ... existing themes
  { value: 'cyberpunk', label: 'Cyberpunk' },
];
```

### Step 3: Verify

The theme will automatically appear in the theme selector in the `StatusBar`. The `applyTheme()` function handles adding and removing body classes.

## CRT Effects

The Chat UI includes CRT-style visual effects that simulate a vintage terminal display. Effects are **disabled by default** and can be toggled via the status bar.

### Scanlines

A repeating horizontal line overlay simulating CRT phosphor scanlines:

```css
body:not(.effects-disabled)::before {
  content: " ";
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.25) 50%
  );
  background-size: 100% 4px;
  z-index: 9999;
  pointer-events: none;
}
```

### Glow / Pulse

A radial vignette with a subtle brightness pulse simulating CRT phosphor glow:

```css
body:not(.effects-disabled)::after {
  content: " ";
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(0, 0, 0, 0.4) 110%
  );
  z-index: 9998;
  pointer-events: none;
  animation: crt-pulse 4s infinite linear;
}
```

### Glitch Animation

A `@keyframes glitch` animation is available for elements that need a glitch/jitter effect:

```css
@keyframes glitch {
  0%   { transform: translate(0) }
  20%  { transform: translate(-2px, 2px) }
  40%  { transform: translate(-2px, -2px) }
  60%  { transform: translate(2px, 2px) }
  80%  { transform: translate(2px, -2px) }
  100% { transform: translate(0) }
}
```

### Effects Toggle

When effects are disabled, the `effects-disabled` class is added to `<body>`:

- The `::before` and `::after` pseudo-elements (scanlines and glow) are hidden.
- All `text-shadow` values are removed via `text-shadow: none !important`.
- All `box-shadow` values on focus/hover states are removed.

## Persistence

Theme and effects preferences are stored in `localStorage` and survive page reloads.

### localStorage Keys

| Key | Type | Description |
|---|---|---|
| `nullclaw_ui_theme` | `string` | Current theme name (e.g., `"matrix"`, `"dracula"`) |
| `nullclaw_ui_effects` | `"true"` or `"false"` | Whether CRT effects are enabled |

### Load Behavior

On page load, the `loadUiPreferences()` function reads from `localStorage`:

- If `nullclaw_ui_theme` is missing or contains an unrecognized value, the **Matrix** theme is used as the fallback.
- If `nullclaw_ui_effects` is missing or contains an invalid value, effects default to **enabled** (`true`).

### Apply Behavior

The `applyUiPreferences()` function:

1. Removes all existing `theme-*` classes from `<body>`.
2. Adds the correct `theme-{name}` class.
3. Adds or removes the `effects-disabled` class based on the effects preference.
