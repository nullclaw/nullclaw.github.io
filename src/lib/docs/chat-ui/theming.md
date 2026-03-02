# Theming

Theme behavior is implemented in `src/lib/theme.ts`.

## Supported Themes

- `matrix`
- `dracula`
- `synthwave`
- `amber`
- `light`

## Storage Keys

- theme: `nullclaw_ui_theme`
- effects toggle: `nullclaw_ui_effects`

## Theme API

- `loadTheme()` / `saveTheme()` / `applyTheme()`
- `loadEffectsEnabled()` / `saveEffectsEnabled()` / `applyEffectsEnabled()`
- exported `SUPPORTED_THEMES` and `THEME_OPTIONS`

## Behavior Rules

- unknown stored theme values are coerced to fallback (`matrix`)
- body gets class `theme-<name>`
- effects toggle controls `effects-disabled` class on `<body>`
