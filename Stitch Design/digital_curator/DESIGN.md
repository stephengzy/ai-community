# Design System: The Digital Curator

## 1. Overview & Creative North Star

This design system is anchored by the **"Editorial Technicality"** North Star. It is designed for platforms where information density is a feature, not a flaw. Unlike standard consumer apps that rely on rounded bubbles and neon gradients, this system draws inspiration from high-end architectural journals and technical whitepapers.

The objective is to break the "template" look. We achieve this through:
*   **Intentional Asymmetry:** Using generous white space on one side of a container to balance dense technical metadata on the other.
*   **The "Museum" Approach:** Treating every piece of content as a curated artifact. High-contrast serif headlines provide an authoritative "voice," while precise sans-serif labels offer technical clarity.
*   **Tonal Authority:** Moving away from harsh black-and-white to a sophisticated palette of off-white and charcoal, punctuated by a singular, earthy "Terra" accent.

---

## 2. Colors

The color palette is built on high-fidelity neutrals that mimic physical materials—fine paper, pressed ink, and clay.

### Core Palette
*   **Surface (Background):** `#F9F9F8` — A warm, off-white base that reduces eye strain compared to pure white.
*   **Primary (Action):** `#863F20` (Terra) — Used for the most critical calls to action.
*   **Primary-Container:** `#A45635` — A softer version of the primary for hover states or secondary importance.
*   **On-Surface (Text):** `#1A1A1A` — A deep charcoal for maximum legibility without the harshness of `#000000`.
*   **Outline-Variant:** `#DAC1B9` — Used sparingly for "Ghost Borders."

### The "No-Line" Rule
To maintain a high-end editorial feel, **do not use 1px solid borders for sectioning.** Conventional borders create visual "noise" that clutters technical interfaces. Instead:
*   **Tonal Separation:** Define boundaries by shifting from `surface` to `surface-container-low` (`#F3F4F3`).
*   **Negative Space:** Use the Spacing Scale to create "gutters" that naturally separate content blocks.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, premium paper sheets. 
*   **Level 0 (Base):** `surface` (#F9F9F8)
*   **Level 1 (Sections):** `surface-container-low` (#F3F4F3)
*   **Level 2 (Cards):** `surface-container-lowest` (#FFFFFF)

### Glassmorphism & Signature Textures
For floating elements (modals, dropdowns, or navigation bars), use a backdrop-blur (12px–20px) with a semi-transparent `surface` color. This ensures the technical content remains the focus while providing a sense of depth and modernity.

---

## 3. Typography

The system utilizes a dual-font strategy to balance intellectual authority with technical precision.

| Role | Font Family | Character | Usage |
| :--- | :--- | :--- | :--- |
| **Display/Headline** | *Newsreader* | Elegant, Serif | Editorial titles, "Problem/Solution" headers. |
| **Title/Body/Label** | *Inter* | Precise, Sans-serif | Metadata, technical descriptions, button text. |

### Hierarchy Highlights
*   **Display-MD (2.75rem):** Reserved for hero editorial moments.
*   **Headline-SM (1.5rem):** The workhorse for content headers.
*   **Body-MD (0.875rem):** Optimized for long-form technical reading with a 1.5x line-height.
*   **Label-SM (0.6875rem):** High-density metadata, always in Uppercase with +5% letter spacing for a "Technical Tag" look.

---

## 4. Elevation & Depth

We reject traditional heavy shadows in favor of **Tonal Layering.**

*   **The Layering Principle:** Depth is achieved by placing `surface-container-lowest` (white) elements onto a `surface` (off-white) background. The subtle contrast creates a "lift" that feels integrated, not forced.
*   **Ambient Shadows:** If a floating action button (FAB) or modal requires a shadow, use a "Micro-Shadow": `0px 4px 20px rgba(26, 28, 28, 0.06)`. The shadow color is a tinted charcoal, mimicking natural light.
*   **The "Ghost Border" Fallback:** When high-density content requires a container (e.g., nested code blocks), use a 1px border with `outline-variant` at **20% opacity**. It should be felt, not seen.
*   **Backdrop Blurs:** Use `surface-variant` (#E2E2E2) at 70% opacity with a blur effect for sticky headers to maintain the editorial flow during scroll.

---

## 5. Components

### Buttons
*   **Primary:** Fill: `primary` (#863F20), Text: `on-primary` (White). 8px radius.
*   **Secondary/Ghost:** No fill. Border: 1px `outline-variant` (20% opacity). Text: `on-surface`.
*   **States:** On hover, primary shifts to `primary-container`. Transition: 200ms ease-out.

### Input Fields
*   **Visual Style:** Forgo the 4-sided box. Use a `surface-container-low` background with a 2px bottom-border in `outline`. This creates a "form" feel common in high-end stationary.
*   **Focus State:** The bottom border transforms to `primary`.

### Cards & Lists
*   **Rule:** Forbid divider lines. 
*   **Separation:** Use a vertical 24px/32px spacing gap or a background shift to `surface-container-high` for hovered list items.
*   **The "Curator" Card:** Cards should feature a 50/50 or 40/60 split between an image/graphic and technical text to maintain the editorial balance.

### Technical Tags (Chips)
*   **Style:** Small, rectangular (4px radius), using `secondary-container` (#E2DFDE) with `label-sm` typography. These should feel like library catalog tags.

---

## 6. Do's and Don'ts

### Do
*   **Do** embrace verticality. Technical content needs room to breathe; use generous margins.
*   **Do** use `Newsreader` for quotes or "Problem" statements to highlight the human element behind the data.
*   **Do** align text to a strict baseline grid to maintain the "Technical" part of the North Star.

### Don'ts
*   **Don't** use pure black (#000) or pure grey (#888). Always use the tinted neutrals defined in the tokens.
*   **Don't** use rounded "Pill" shapes for everything. Stick to the 8px (`lg`) radius for containers and buttons to keep the look structured.
*   **Don't** use icons as the primary source of navigation. Use clear, `inter` labels. Icons are secondary ornaments in this system.