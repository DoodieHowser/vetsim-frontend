# VetSim — Warm Clinic Design System

The primary visual language for **VetSim**, a veterinary clinical-reasoning simulator for vet students, interns, residents and new grads. Warm, approachable and game-like.

## Files

- **tokens.css** — the source of truth. All design tokens as CSS custom properties (`--color-*`, `--ds-*`, `--border-radius-*`, `--font-*`, `--space-*`, type scale). Drop into any page and reference with `var(--token-name)`. Token *names* are stable across themes — swap the values (or add a `[data-theme]` block) to re-skin the whole product with no markup changes.
- **Warm Clinic Design System.html** — the visual reference. Renders the live palette (each swatch reads its real token value), the type scale, spacing/radii/elevation, and example components (buttons, chips, vitals meters, inputs, tabs, finding card). Open it in a browser.

## Fonts

| Role | Family | Use |
|------|--------|-----|
| Display | **Bricolage Grotesque** | Titles, patient names, scores, numerals |
| UI / body | **Hanken Grotesk** | All interface text and prose |
| Mono / data | **Spline Sans Mono** | Lab reports, IDs, reference ranges |

Load via Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@400..800&family=Spline+Sans+Mono:wght@400..600&display=swap" rel="stylesheet" />
```

## Core palette

| Token | Value | Role |
|-------|-------|------|
| `--ds-accent` | `#C4623E` | Terracotta — primary action |
| `--ds-accent-soft` | `#FBEDE6` | Accent wash (soft buttons, active tabs) |
| `--ds-good` | `#4F7C5A` | Pine — trust/health meters, positive |
| `--ds-gold` | `#D89A3C` | Grade/score highlight |
| `--color-background-primary` | `#FFFDF9` | Warm white — cards, surfaces |
| `--color-background-secondary` | `#F7F0E5` | Cream — rails, headers |
| `--color-text-primary` | `#2E2620` | Espresso — headings & body |
| `--color-text-secondary` | `#8C7B68` | Taupe — captions, labels |

Full text / background / border ramps and the warning/danger/info/success tints are defined in `tokens.css`.

## Principles

1. **Warm, never clinical-cold.** Cream paper and terracotta over stark white and blue.
2. **Game-like clarity.** Vitals as glowing meters, grades and scores in display type, status as coloured chips.
3. **Soft geometry.** Rounded corners (`--border-radius-sm/md/lg` = 8/13/20px), gentle warm-tinted shadows.
4. **Token names are the contract.** Re-theme by changing values, never by renaming tokens. VetSim ships three themes (Warm Clinic primary, plus Field Guide and Sim Arcade) on this same token set.

## Related themes

Warm Clinic is the **primary** direction. The VetSim prototype also includes two alternates built on the identical token names:
- **Field Guide** — parchment + ochre + ink, serif display, paper grain.
- **Sim Arcade** — espresso dark mode, coral + amber glow, geometric display.

Ask the prototype's Tweaks → Direction panel to switch between them live.
