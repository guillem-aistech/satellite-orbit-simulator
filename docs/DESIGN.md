# Design System

## Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      3D VIEWPORT                                │
│                   (Full screen canvas)                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    CONTROL PANEL                                │
│              (Collapsible, bottom bar)                          │
└─────────────────────────────────────────────────────────────────┘
```

- Full-screen 3D viewport with collapsible control panel at bottom
- Panel uses semi-transparent dark background
- HUD elements (axis indicator) overlay in screen-space

---

## Fluid Design

No breakpoints. All sizing scales smoothly with viewport using `clamp(min, preferred, max)`.

```css
/* Example: spacing that scales from 0.5rem to 0.75rem based on viewport */
gap: clamp(0.5rem, 1vw, 0.75rem);

/* Example: font size that scales from 0.875rem to 1rem */
font-size: clamp(0.875rem, 1.5vw, 1rem);
```

**How clamp() works:**

- Below min viewport → uses min value
- Above max viewport → uses max value
- Between → scales proportionally with preferred (vw) value

**Guidelines:**

- Use spacing tokens (`--space-*`) for gaps, padding, margins
- Use typography tokens (`--title-*`, `--body-*`, `--label-*`) for text
- Prefer `vw` units in the preferred value for viewport-relative scaling
- Stack components (XStack/YStack) manage spacing via `gap`, not individual margins

**HUD elements** use percentage-based positioning (e.g., 8% margin from corner) to maintain proportions across screen sizes.

---

## Color Tokens

Defined in `src/styles/tokens.css`.

| Token                      | Value                    | Usage                               |
| -------------------------- | ------------------------ | ----------------------------------- |
| `--surface`                | `#0A0A14`                | App background                      |
| `--surface-container-low`  | `rgba(15, 15, 25, 0.9)`  | Subtle containers                   |
| `--surface-container`      | `rgba(10, 10, 20, 0.9)`  | Control panel, cards                |
| `--surface-container-high` | `rgba(20, 20, 35, 0.95)` | Tooltips, dropdowns, modals         |
| `--on-surface`             | `#FFFFFF`                | Primary text                        |
| `--on-surface-variant`     | `rgba(255,255,255,0.7)`  | Secondary text, hints               |
| `--outline`                | `rgba(255,255,255,0.1)`  | Dividers, borders                   |
| `--primary`                | `#4A9DFF`                | Buttons, focus rings, active states |
| `--primary-hover`          | `#6BB0FF`                | Hover states                        |
| `--on-primary`             | `#000000`                | Text on primary surfaces            |

---

## Spacing Tokens

Fluid values that scale with viewport.

| Token        | Value                           | Usage                           |
| ------------ | ------------------------------- | ------------------------------- |
| `--space-xs` | `clamp(0.25rem, 0.5vw, 0.5rem)` | Tight gaps, icon padding        |
| `--space-sm` | `clamp(0.5rem, 1vw, 0.75rem)`   | Buttons, inputs, control groups |
| `--space-md` | `clamp(0.75rem, 2vw, 1.25rem)`  | Cards, section gaps             |
| `--space-lg` | `clamp(1rem, 3vw, 2rem)`        | Panels, large gaps              |
| `--space-xl` | `clamp(1.5rem, 4vw, 3rem)`      | Layout margins                  |

---

## Typography Tokens

Font family: **Poppins**

| Token        | Size                             | Weight | Usage             |
| ------------ | -------------------------------- | ------ | ----------------- |
| `--title-lg` | `clamp(1.25rem, 2.5vw, 1.5rem)`  | 600    | Panel headings    |
| `--title-sm` | `clamp(1rem, 2vw, 1.25rem)`      | 600    | Section titles    |
| `--body-lg`  | `clamp(0.875rem, 1.5vw, 1rem)`   | 400    | Primary content   |
| `--body-sm`  | `clamp(0.8rem, 1.2vw, 0.875rem)` | 400    | Secondary content |
| `--label-lg` | `clamp(0.8rem, 1.2vw, 0.875rem)` | 500    | Control labels    |
| `--label-sm` | `clamp(0.7rem, 1vw, 0.75rem)`    | 500    | Hints, units      |
