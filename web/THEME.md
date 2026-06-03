# THEME.md — AutoNow web

AutoNow is a transport platform. The brand is **white + orange**. Light theme only — never use Tailwind `dark:` variants.

Tokens are defined in `src/index.css` under `@theme`. Use them via Tailwind utility classes (`bg-brand-500`, `text-brand-600`, `border-brand-500`, etc.) — Tailwind v4 generates utilities for every `--color-*` token automatically.

## Brand palette

Use `bg-brand-*` / `text-brand-*` / `border-brand-*` etc.

| Token       | Hex       | Use                                             |
|-------------|-----------|-------------------------------------------------|
| `brand-50`  | `#fff7ed` | tinted backgrounds, hover surfaces on white     |
| `brand-100` | `#ffedd5` | subtle highlights, badge backgrounds            |
| `brand-200` | `#fed7aa` | dividers, soft accents                          |
| `brand-300` | `#fdba74` | secondary borders                               |
| `brand-400` | `#fb923c` | gradient stops                                  |
| `brand-500` | `#f97316` | **primary** — buttons, links, active state, focus rings |
| `brand-600` | `#ea580c` | **primary hover** — button hover, pressed state |
| `brand-700` | `#c2410c` | strong text on light surfaces                   |
| `brand-800` | `#9a3412` | rare — high-emphasis text                       |
| `brand-900` | `#7c2d12` | rare — headings on tinted brand surfaces        |

## Semantic surface tokens

For neutral chrome (cards, page backgrounds, borders, body text). Prefer these over hard-coded gray shades when the role is semantic.

| Token             | Maps to    | Use                                  |
|-------------------|------------|--------------------------------------|
| `surface`         | white      | cards, modals, primary panels        |
| `surface-muted`   | gray-50    | page background                      |
| `surface-subtle`  | gray-100   | secondary panels, hover on white     |
| `border`          | gray-200   | dividers, input/card borders         |
| `text`            | gray-900   | body text                            |
| `text-muted`      | gray-600   | secondary text, captions             |

Used as: `bg-surface`, `bg-surface-muted`, `border-border`, `text-text`, `text-text-muted`.

## Status colors (do not change)

These come from Tailwind defaults and stay consistent across the app:

- **Success:** `green-500` / `green-600`, backgrounds `green-50` / `green-100`
- **Danger / destructive:** `red-500` / `red-600`, backgrounds `red-50` / `red-100`
- **Warning:** `amber-500` / `amber-600` (use sparingly — clashes with brand orange; prefer red for errors)
- **Info / neutral:** gray scale

Flowbite components: use `color="failure"` for destructive, `color="success"` for positive states, `color="gray"` for neutral.

## Rules

1. **Primary actions use brand orange.** Flowbite `<Button color="primary">` (preferred) or, when not using Flowbite, `bg-brand-500 hover:bg-brand-600 text-white`.
2. **No purple, violet, indigo, or blue as accent colors.** They were the previous palette and should be migrated to brand-*.
3. **Cards stay white.** `bg-surface` (or `bg-white`). Avoid filling cards with gradients except for hero/featured surfaces.
4. **Hero / featured gradients** use brand: `bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600`.
5. **Focus rings** use brand: `focus:ring-brand-500`.
6. **Never** add Tailwind `dark:` variants, `darkMode` config, or `prefers-color-scheme` media queries.
7. **Status colors win over brand.** A delete button is red, not orange. A success alert is green. Don't tint everything orange.

## Adding a new color

Don't hard-code hex values in components. If you need a new shade, add it as a token under `@theme` in `index.css` and document it here.
