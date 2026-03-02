# Theming

Theme management is implemented in `src/lib/theme.ts`.

## Supported Theme Values

- `matrix`
- `dracula`
- `synthwave`
- `amber`
- `light`

## Storage Keys

- theme: `nullclaw_ui_theme`
- effects toggle: `nullclaw_ui_effects`

## Theme API

`theme.ts` exports:

- `loadTheme()` / `saveTheme()` / `applyTheme()`
- `loadEffectsEnabled()` / `saveEffectsEnabled()` / `applyEffectsEnabled()`
- `SUPPORTED_THEMES` and `THEME_OPTIONS`

## Behavior Notes

- unknown stored theme values are coerced to fallback (`matrix` by default)
- effects flag toggles `effects-disabled` class on `<body>`
- theme class prefix is `theme-<name>`
