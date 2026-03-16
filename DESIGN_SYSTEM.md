# Design System — Sakthivel Portfolio

> This document is the single source of truth for the design, structure, and component behaviour of this portfolio.  
> Read this before making **any** visual, structural, or animation change.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Core Design Philosophy](#3-core-design-philosophy)
4. [Color System](#4-color-system)
5. [Typography](#5-typography)
6. [Spacing & Layout](#6-spacing--layout)
7. [Border Radius](#7-border-radius)
8. [Breakpoints & Responsive Strategy](#8-breakpoints--responsive-strategy)
9. [Page Architecture](#9-page-architecture)
10. [Shared Components](#10-shared-components)
11. [Section Reference](#11-section-reference)
12. [Animation System](#12-animation-system)
13. [Theme System](#13-theme-system)
14. [Adding New Content](#14-adding-new-content)
15. [Asset Guidelines](#15-asset-guidelines)
16. [Do / Don't Cheat-sheet](#16-do--dont-cheat-sheet)

---

## 1. Overview

This is a single-page portfolio built with React + TypeScript + Vite. It features:

- **Scroll-driven storytelling** — every section is revealed through scroll-triggered GSAP animations.
- **Cinematic intro** — a slot-machine loader plays for ~3.6 s before content appears.
- **Inverted section** — the Skills section intentionally flips to the opposite background to create visual contrast.
- **Zero border-radius philosophy** — all cards and containers use sharp corners (`--radius: 0rem`). Rounded shapes are reserved exclusively for pills (nav, skill badges, dynamic island).
- **Mono-chromatic palette** — the entire site is built on achromatic greys (HSL hue = 0, saturation = 0%). No brand accent colours. Contrast is created through light/dark surface layering.

---

## 2. Tech Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | React | 18.3.x |
| Language | TypeScript | via tsconfig |
| Build tool | Vite | latest |
| Styling | Tailwind CSS + CSS custom properties | latest |
| UI primitives | Radix UI (via shadcn/ui) | various |
| Animation | GSAP 3 | 3.14.x |
| Smooth scroll | Lenis (`@studio-freight/lenis`) | 1.0.42 |
| Physics | Matter.js | 0.20.x |
| Routing | React Router DOM | v6 |
| Data fetching | TanStack React Query | v5 |
| Icons | Lucide React | 0.462.x |
| Package manager | Bun (bun.lockb present) | — |

### Key config files

| File | Purpose |
|---|---|
| `tailwind.config.ts` | Extends Tailwind with CSS-variable-based colour tokens |
| `src/index.css` | Defines all CSS custom properties (design tokens) for both dark and light themes |
| `src/App.tsx` | App shell — wraps with QueryClient, TooltipProvider, BrowserRouter |
| `src/pages/Index.tsx` | Main page — composes all sections and manages intro state |
| `components.json` | shadcn/ui config |

---

## 3. Core Design Philosophy

These are the rules that govern every decision in this portfolio.

1. **Monochromatic** — All colours are achromatic (HSL hue 0, saturation 0%). Trust contrast. Never introduce a brand accent unless the entire token system is updated.
2. **Sharp corners for surfaces, pills for interactive elements** — Cards, sections, images = `border-radius: 0`. Navigation, badges, skill tags = `border-radius: 9999px`.
3. **Scroll is the narrative** — Every element enters via scroll. Nothing should be visible without interaction (except the loader and hero after intro).
4. **Typography does the heavy lifting** — Two fonts only: `Inter` for body, `Space Grotesk` for all headings and display text.
5. **Inverted section creates breathable contrast** — Skills and Footer sections use an inverted background. Do not add more inverted sections without purpose.
6. **GSAP-first animation** — never use CSS transitions for entrance animations. CSS transitions are only allowed for micro-interactions (hover states, theme icon, scale on hover).
7. **Lenis lerp = 0.07** — This controls the scroll "feel". Do not change this value. It is deliberately slow for a cinematic quality.

---

## 4. Color System

All colours are defined as HSL CSS custom properties on `:root` (dark mode, default) and `.theme-light` (light mode). They are wired into Tailwind's colour map in `tailwind.config.ts` so you can use them as `bg-background`, `text-foreground`, etc.

### 4.1 Base Tokens (shadcn/ui compatible)

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| `--background` | `0 0% 4%` (#0a0a0a) | `0 0% 95%` (#f2f2f2) | Page background |
| `--foreground` | `0 0% 95%` | `0 0% 4%` | Primary text |
| `--card` | `0 0% 7%` | `0 0% 100%` | Card surfaces |
| `--card-foreground` | `0 0% 95%` | `0 0% 4%` | Text on cards |
| `--primary` | `0 0% 95%` | `0 0% 8%` | Primary interactive elements |
| `--primary-foreground` | `0 0% 4%` | `0 0% 95%` | Text on primary elements |
| `--secondary` | `0 0% 12%` | `0 0% 90%` | Secondary surfaces |
| `--secondary-foreground` | `0 0% 95%` | `0 0% 8%` | Text on secondary surfaces |
| `--muted` | `0 0% 15%` | `0 0% 90%` | Muted backgrounds |
| `--muted-foreground` | `0 0% 55%` | `0 0% 40%` | Muted text (labels, meta) |
| `--accent` | `0 0% 18%` | `0 0% 85%` | Hover/accent surfaces |
| `--accent-foreground` | `0 0% 95%` | `0 0% 8%` | Text on accent |
| `--border` | `0 0% 18%` | `0 0% 80%` | Dividers, card borders |
| `--input` | `0 0% 18%` | `0 0% 80%` | Input borders |
| `--ring` | `0 0% 55%` | — | Focus ring |
| `--destructive` | `0 84% 60%` | — | Error states |
| `--radius` | `0rem` | `0rem` | Border radius (always 0) |

### 4.2 Portfolio-Specific Tokens

These tokens are not part of shadcn/ui — they're portfolio design decisions.

| Token | Dark Mode | Light Mode | Used In |
|---|---|---|---|
| `--section-dark` | `0 0% 4%` | `0 0% 95%` | Hero, Manifesto, Projects, Philosophy, footer content bg |
| `--section-light` | `0 0% 95%` | `0 0% 4%` | — |
| `--hero-bg` | `0 0% 4%` | `0 0% 95%` | Hero section background |
| `--hero-fg` | `0 0% 93%` | `0 0% 10%` | Hero text |
| `--manifesto-muted` | `0 0% 25%` | `0 0% 70%` | Manifesto un-highlighted words |
| `--manifesto-active` | `0 0% 96%` | `0 0% 8%` | Manifesto highlight bg (pill behind word) |
| `--pill-border` | `0 0% 20%` | — | — |

### 4.3 Inverted Section Tokens (Skills + Footer transition)

Skills section is the **only** section that inverts. In dark mode it goes white; in light mode it goes dark.

| Token | Dark Mode | Light Mode | Used In |
|---|---|---|---|
| `--inv-bg` | `0 0% 100%` (white) | `0 0% 6%` | Skills section bg |
| `--inv-fg` | `0 0% 4%` (near-black) | `0 0% 95%` | Text on inverted bg |
| `--inv-muted` | `0 0% 50%` | `0 0% 55%` | Labels on inverted bg |
| `--inv-border` | `0 0% 85%` | `0 0% 25%` | Borders on inverted bg |
| `--inv-card-bg` | `0 0% 8%` | `0 0% 92%` | Filled skill card bg |
| `--inv-card-fg` | `0 0% 95%` | `0 0% 8%` | Text on filled skill cards |
| `--inv-wave-1` | `0 0% 94%` | `0 0% 12%` | First (deepest) wave |
| `--inv-wave-2` | `0 0% 97%` | `0 0% 8%` | Middle wave |
| `--inv-wave-3` | `0 0% 100%` | `0 0% 6%` | Top wave (matches `inv-bg`) |

### 4.4 Navigation Pill Tokens

| Token | Dark Mode | Light Mode |
|---|---|---|
| `--nav-bg` | `0 0% 8%` | `0 0% 96%` |
| `--nav-border` | `0 0% 18%` | `0 0% 82%` |
| `--nav-active-bg` | `0 0% 95%` | `0 0% 8%` |
| `--nav-active-fg` | `0 0% 4%` | `0 0% 95%` |
| `--nav-muted` | `0 0% 60%` | `0 0% 45%` |

### 4.5 Rules for Editing Colours

- Always edit **both** `:root` and `.theme-light` when changing a token.
- Never use a raw hex or rgb value in a component. Always use `hsl(var(--token-name))`.
- Do not introduce hue or saturation. The palette is intentionally achromatic.
- Maintain a minimum contrast ratio of **4.5:1** between text and background.

---

## 5. Typography

### 5.1 Font Families

Two fonts. Nothing else.

| Role | Font | Weight range | Applied via |
|---|---|---|---|
| Body / UI text | `Inter` | 400, 500 | `font-family: 'Inter', sans-serif` on `html` |
| Display / Headings | `Space Grotesk` | 500, 700 | `font-family: 'Space Grotesk', sans-serif` on `h1–h6` and explicit inline |

Both fonts are loaded via Google Fonts (declared in `index.html`).

### 5.2 Type Scale & Usage

| Size class | Usage |
|---|---|
| `text-[10px]` | Block counter labels (manifesto "01", "02") |
| `text-xs` (`0.75rem`) | Section meta labels, skill group headers, nav abbreviations |
| `text-sm` (`0.875rem`) | Body copy, hero subtext, skill pill labels |
| `text-base` (`1rem`) | General body text, philosophy card descriptions |
| `text-xl` / `text-2xl` | Manifesto lines (mobile), card sub-headings |
| `text-2xl` / `text-3xl` | Project card titles, philosophy card titles |
| `text-4xl` | Section headings mobile, footer heading mobile |
| `text-5xl` / `text-6xl` | Section headings desktop |
| `text-7xl` / `text-8xl` | Large display headings (Skills, Philosophy) |
| `clamp(90px, 18vw, 240px)` | Hero name via `TextPressure` — fluid, never literal px in code |

### 5.3 Letter Spacing

| Class | Value | Used for |
|---|---|---|
| `tracking-[0.4em]` | 0.4em | Hero tagline ("AI–Native Engineer…") |
| `tracking-[0.3em]` | 0.3em | Skills meta label ("What I work with") |
| `tracking-[0.2em]` | 0.2em | Skill group sub-headings |
| `tracking-[0.1em]` | 0.1em | Custom cursor "VIEW" text |
| `tracking-widest` | 0.1em | Nav labels, dynamic island labels |
| `tracking-tight` | -0.025em | Large display headings (Skills section) |
| `tracking-wide` | 0.025em | Footer bottom bar |

### 5.4 Line Height

| Context | Class | Value |
|---|---|---|
| Display headings | `leading-tight` | 1.25 |
| Manifesto large text | `leading-snug` | 1.375 |
| Body / descriptions | `leading-relaxed` | 1.625 |
| Hero name | `leading-[0.9]` | 0.9 (tightly packed display) |

### 5.5 Font Weight

- `font-bold` (700) — all headings, hero name, manifesto lines, project titles.
- `font-medium` (500) — skill pill text, email link.
- `font-semibold` (600) — nav labels.
- Default (400) — body paragraphs, meta labels.

---

## 6. Spacing & Layout

### 6.1 Container

Tailwind's container is centred with `padding: 2rem` and maxes at `1400px` (`2xl`). It is **not used** in this portfolio — sections use full-width layouts with explicit horizontal padding instead.

### 6.2 Section Padding

| Context | Classes |
|---|---|
| Standard section vertical | `py-24 md:py-32` |
| Manifesto (extra breathing room) | `py-40 md:py-56` |
| Philosophy section | `py-24 md:py-32` (outer), `py-16 md:py-20` per card |
| Footer content bottom | `pb-8 md:pb-16` |

### 6.3 Horizontal Padding

Use this scale consistently. Never invent new values.

| Context | Classes |
|---|---|
| Standard content | `px-8 md:px-16` |
| Wider content (Skills, footer) | `px-8 md:px-16 lg:px-24` |
| Desktop project track | `px-16` |
| Manifesto text | `px-6 sm:px-8 md:px-16` |

### 6.4 Gap & Spacing Within Components

| Component | Spacing |
|---|---|
| Philosophy card list | `gap-0` (no gap, uses internal `py-16 md:py-20` per card) |
| Skill groups | `space-y-16` between groups |
| Skill pills within group | `flex-wrap gap-3` |
| Project cards (desktop) | `gap-8` |
| Project cards (mobile) | `gap-10` |
| Manifesto blocks | `mb-44 md:mb-64` |
| Footer bottom bar | `pt-8` with top border |

---

## 7. Border Radius

The default `--radius` is `0rem`. This is intentional.

| Shape | Radius | Where |
|---|---|---|
| All content cards / containers | `0` | Project images, philosophy cards, etc. |
| Image containers | `rounded-sm` (≈2px – functionally 0) | Project card images |
| Skill pills | `rounded-full` | Skill badges in SkillsSection |
| Navigation pill | `rounded-full` | Navigation component |
| Dynamic island | `9999px` (inline) | DynamicIsland |
| Highlight bg (manifesto) | `6px` (inline) | Highlight word pills in ManifestoSection |
| Footer container top | `48px 48px 0 0` (inline) | FooterSection content div |
| Intro loader frame | `20px` (start) → `0px` (end of animation) | IntroLoader |

**Rule:** If you're adding a new card or container — use `rounded-none`. If you're adding a new interactive pill / badge — use `rounded-full`.

---

## 8. Breakpoints & Responsive Strategy

Standard Tailwind breakpoints are used.

| Prefix | Width | Strategy |
|---|---|---|
| (default) | < 768px | Mobile-first base |
| `md:` | ≥ 768px | Tablet / small desktop |
| `lg:` | ≥ 1024px | Desktop |

### Notable responsive behaviours

- **ProjectsSection** — horizontal scroll carousel on desktop, simple vertical stack on mobile. Swap is controlled by `useIsMobile()` hook (`hooks/use-mobile.tsx`).
- **PhilosophySection** — stacks vertically on mobile, becomes `md:flex-row` with sticky left column on desktop.
- **HeroSection** — `TextPressure` is fluid and scales with viewport using `clamp`.
- **ManifestoSection** — font size scales from `text-xl sm:text-2xl md:text-4xl lg:text-5xl`.
- **IntroLoader digit height** — `80px` on mobile, `130px` on desktop (detected via `window.innerWidth < 768`).
- **SkillsSection wave height** — `clamp(160px, 25vw, 400px)`.
- **FooterSection heading** — `text-3xl sm:text-4xl md:text-6xl lg:text-8xl`.

---

## 9. Page Architecture

### 9.1 Section Order

The page renders sections in this exact order (see `src/pages/Index.tsx`):

```
1. IntroLoader       (overlay, removed on complete)
2. ThemeToggle       (fixed, top-right)
3. ─── <main> ───
4.   HeroSection     #hero
5.   ManifestoSection  #manifesto
6.   ProjectsSection   #projects
7.   PhilosophySection #philosophy
8.   SkillsSection     #skills
9.   FooterSection     #footer
```

### 9.1.1 Secondary Pages

| Route | Page file | Description |
|---|---|---|
| `/projects` | `src/pages/Projects.tsx` | Full grid of all projects (real + placeholder). Standalone page with `SmoothScroll`, `ThemeToggle`, back link to `/`, and GSAP scroll-triggered card entrances. |

**Floating Image Portal (`/projects`):**  
A `position: fixed`, `pointer-events: none` image container (350×260px, `z-50`) that becomes visible when hovering project cards with images. Uses `gsap.quickTo` for `x`/`y` with 0.4s `power3.out` ease for smooth mouse tracking. Image swaps based on hovered card. Placeholder cards (no image) don’t trigger the portal.

**Hover-Driven Image Masking (`/projects`):**  
CSS micro-interaction (allowed per design system rules) on project card images:  
- `.project-image-mask`: `clip-path: inset(0%)` → `inset(4% round 6px)` on group hover  
- `.project-image-inner`: `scale(1)` → `scale(1.05)` on group hover  
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out feel), 0.5s duration  

### 9.2 Section IDs

These IDs are critical — they are used by both `Navigation` and `DynamicIsland` to track active section via `ScrollTrigger`.

| ID | Section |
|---|---|
| `hero` | HeroSection |
| `manifesto` | ManifestoSection |
| `projects` | ProjectsSection |
| `philosophy` | PhilosophySection |
| `skills` | SkillsSection |
| `footer` | FooterSection |

> **Rule:** Never rename an `id` without updating `Navigation.tsx`, `DynamicIsland.tsx`, and this document.

### 9.3 Z-index layers

| Layer | z-index | Element |
|---|---|---|
| IntroLoader overlay | `z-[100]` | Full page cover during loading |
| Navigation pill | `z-[60]` | Bottom center |
| ThemeToggle | `z-[60]` | Top right |
| DynamicIsland | `z-50` | Bottom center (may coexist or replace nav) |
| Custom cursor | `z-9999` | `.view-cursor` for project hover |
| Section content | — | Standard stacking |

---

## 10. Shared Components

### 10.1 `SmoothScroll`

`src/components/SmoothScroll.tsx`

Wraps the entire app. Initialises Lenis and connects it to GSAP's ticker and `ScrollTrigger`.

```tsx
<SmoothScroll>
  {children}
</SmoothScroll>
```

**Config:**
- `lerp: 0.07` — do not change. This creates the cinematic scroll feel.
- `smoothWheel: true`
- Connected via `gsap.ticker.add((time) => lenis.raf(time * 1000))`

### 10.2 `IntroLoader`

`src/components/IntroLoader.tsx`

Full-screen loading animation. Receives `onComplete: () => void` callback which the parent (`Index.tsx`) uses to flip `introComplete` state.

**Animation phases:**
1. Frame fades in (scale 0.9 → 1)
2. Lever pulls down and snaps back
3. Three slot-machine reels spin, land on `1`, `0`, `0` → displays "100 %"
4. Lever morphs into `%` symbol
5. Frame fills black and **scales 25× to cover the entire screen**
6. Total duration: ~3.6 s → hero content animations have `delay: 3.6`

**Visual language:**
- White background, pure black elements
- Font: `Space Grotesk` 700
- Border: `2px solid black`, `border-radius: 20px` (collapses to 0 at end)

> Do not change the `delay: 3.6` in `HeroSection.tsx` unless you change the loader duration.

### 10.3 `Navigation`

`src/components/Navigation.tsx`

Floating pill at the bottom of the viewport. Appears after 300px of scroll.

**Structure:**
- Progress bar (top of pill, `scaleX` driven by scroll %)
- `ThemeToggle` (left side)
- Separator line
- 6 nav item buttons (H / M / W / P / S / C)

**Behaviour:**
- Inactive: shows single character abbreviation, `transparent` bg
- Hovered: shows full label, `nav-border` bg
- Active (ScrollTrigger determined): shows full label, `nav-active-bg` bg, `nav-active-fg` text

**Nav item labels:**
| Char | Full label | Section |
|---|---|---|
| H | Home | #hero |
| M | Manifesto | #manifesto |
| W | Works | #projects |
| P | Philosophy | #philosophy |
| S | Stack | #skills |
| C | Contact | #footer |

### 10.4 `ThemeToggle`

`src/components/ThemeToggle.tsx`

- Fixed `top-6 right-6`, `z-[60]`
- Toggles `.theme-light` class on `document.documentElement`
- Persists to `localStorage` under key `"theme"`
- Icon: `Sun` (dark→light), `Moon` (light→dark) from `lucide-react`
- Icon entrance: `gsap.fromTo` fade-in at `delay: 4` (after intro)
- Icon swap: `gsap.fromTo` rotate from -90° back to 0°

### 10.5 `DynamicIsland`

`src/components/DynamicIsland.tsx`

Secondary navigation indicator. Shows current section name; click to expand and reveal email link.

- Wrapped in `Magnetic` with `strength={10}`
- Default: compact pill showing section label (e.g., `01 / Hero`)
- Expanded: shows label + mailto link

> Note: Both `Navigation` and `DynamicIsland` are positioned at `bottom-8`. Currently `DynamicIsland` is not rendered in `Index.tsx` — `Navigation` replaced it. Do not add both simultaneously.

### 10.6 `Magnetic`

`src/components/Magnetic.tsx`

HOC wrapper that gives children a magnetic cursor effect.

```tsx
<Magnetic strength={30} className="inline-block">
  <a href="...">Link Text</a>
</Magnetic>
```

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | ReactNode | required | Content to magnetise |
| `strength` | number | `20` | Attraction intensity |
| `className` | string | `""` | Wrapper class |

**Implementation:** Uses `gsap.quickTo` with `elastic.out(1, 0.3)` easing, duration 0.8s. Mouse must be within the element's bounding box for effect to trigger.

### 10.7 `TextPressure`

`src/components/TextPressure.tsx`

Variable font component. Each character responds to mouse proximity by shifting font-variation settings (width, weight, italic).

```tsx
<TextPressure
  text="SAKTHIVEL"
  flex
  alpha={false}
  stroke={false}
  width
  weight
  italic
  textColor="hsl(var(--foreground))"
  strokeColor="#333333"
  minFontSize={40}
/>
```

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | string | `'Compressa'` | Text to display |
| `fontFamily` | string | `'Compressa VF'` | Variable font name |
| `fontUrl` | string | Cloudinary URL | Variable font URL |
| `width` | boolean | `true` | Vary font-width on hover |
| `weight` | boolean | `true` | Vary font-weight on hover |
| `italic` | boolean | `true` | Vary italic on hover |
| `alpha` | boolean | `false` | Vary opacity per char |
| `flex` | boolean | `true` | Use flex layout |
| `stroke` | boolean | `false` | Add text stroke |
| `textColor` | string | `'#FFFFFF'` | Text colour |
| `minFontSize` | number | `24` | Minimum font size |

> Used only in `HeroSection` for the "SAKTHIVEL" name. Height container uses `clamp(90px, 18vw, 240px)`.

### 10.8 `FallingText`

`src/components/FallingText.tsx`

Physics-based text where words fall and interact using Matter.js. Not currently used in any active section but available.

**Props:**
| Prop | Type | Default |
|---|---|---|
| `text` | string | `''` |
| `highlightWords` | string[] | `[]` |
| `trigger` | `'auto' \| 'scroll' \| 'click' \| 'hover'` | `'auto'` |
| `gravity` | number | `1` |
| `mouseConstraintStiffness` | number | `0.2` |
| `fontSize` | string | `'1rem'` |

### 10.9 `NavLink`

`src/components/NavLink.tsx`

Thin wrapper around React Router's `NavLink` that accepts `className`, `activeClassName`, and `pendingClassName` as plain strings (instead of the function pattern). Used for standard page navigation links if needed.

---

## 11. Section Reference

### 11.1 HeroSection

**File:** `src/components/sections/HeroSection.tsx`  
**ID:** `#hero`  
**Background:** `hsl(var(--section-dark))`  
**Height:** `h-screen` (100vh)  
**Layout:** `flex flex-col items-center justify-center text-center`

**Content elements:**
| Element | Font | Size | Colour token |
|---|---|---|---|
| Tagline ("AI–Native Engineer…") | Inter | `text-xs md:text-sm`, `tracking-[0.4em]` uppercase | `muted-foreground` |
| Name (TextPressure) | Compressa VF variable | `clamp(90px, 18vw, 240px)` | `foreground` |
| Subtext ("I build professional…") | Inter | `text-sm md:text-base leading-relaxed` | `muted-foreground` |

**Entrance animations** (all with `delay: 3.6` to start after intro):
- Name: `clipPath: inset(50% 30%)` → `inset(0%)`, 1.6s, `power4.out`
- Tagline: wipe `clipPath: inset(0 100% 0 0)` → `inset(0 0%)`, 1.2s, `power4.inOut`, offset +0.4
- Subtext: fade up `y: 30 → 0`, 1.0s, `power3.out`, offset +0.8

**Scroll parallax:** On scroll, name moves down at 100× progress, tagline at 50× (and fades), subtext at 30× (and fades).

**Scroll-driven clip-path masking:**  
A `clipRef` wrapper wraps all hero content. As the user scrolls, the wrapper's `clipPath` animates from `inset(0% round 0px)` to `inset(8% round 48px)`, creating a cinematic "window closing" effect. Driven by the same `ScrollTrigger` that handles parallax.

---

### 11.2 ManifestoSection

**File:** `src/components/sections/ManifestoSection.tsx`  
**ID:** `#manifesto`  
**Background:** `hsl(var(--section-dark))`  
**Padding:** `py-40 md:py-56`

**Content:**
Four text blocks with a flowing SVG path behind them. Each block has a block counter label (`01`, `02`, …) and 3–6 lines of text.

**Highlight words** (words that get a background pill animation when revealed):
```
"intuition", "systems", "ship", "production", "live", "faster",
"No ceremony", "works", "question", "product"
```

**Typography:**
- Block counter: `text-[10px] tracking-[0.5em] uppercase`, Inter, `muted-foreground`
- Block lines: `text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-snug`, Space Grotesk, `foreground`
- Highlighted words: same size, colour `section-dark` (inverted), with `manifesto-active` background pill

**Animations per block:**
1. Lines enter: `y: 50 → 0, opacity: 0 → 1`, `power3.out`, staggered by 0.15s per line
2. Scramble effect: characters randomise through `!@#$%&*+^?/<>{}[]~` for 10 iterations at 30ms/frame before resolving
3. Highlight background: `scaleX: 0 → 1`, 0.6s, `power3.out`, triggered at line start
4. Leave back: lines fade back to `y: 50, opacity: 0`

**SVG flowing line:**
- Single continuous S-curve spanning the full section height  
- Stroke: `hsl(0 0% 25%)`, `strokeWidth: 10`, `opacity: 0.5`
- Animated via `strokeDashoffset` driven by scroll scrub

---

### 11.3 ProjectsSection

**File:** `src/components/sections/ProjectsSection.tsx`  
**ID:** `#projects`  
**Background:** `hsl(var(--section-dark))`  
**Responsive split:** `useIsMobile()` → `MobileProjects` or `DesktopProjects`

**Projects data:**
```
Redactify     — AI Security, Privacy      — /src/assets/redactify.png
VoiceSOP      — Applied AI, Automation    — /src/assets/voicesop.png
Groundwork    — Developer Tooling, Architecture — /src/assets/groundwork.png
daeq.in       — Design, User Experience  — /src/assets/daeq.png
```

**Desktop layout:**
- Wrapper `div` height set dynamically = `track.scrollWidth - window.innerWidth + 100vh`
- Sticky `top-0 h-screen` inner container
- Horizontal `flex` track translated via GSAP `x` on scroll progress
- Heading column: `w-[30vw]`
- Project cards: `w-[40vw] flex-shrink-0`, `aspect-[4/3]` image, `rounded-sm`
- Image parallax: `xPercent: -8 * progress` on image wrapper at 116% width
- Custom cursor: `.view-cursor` appears on card hover

**Mobile layout:**
- Simple `flex-col gap-10`
- Full-width `aspect-[4/3]` images
- Cards stagger in with `y: 60 → 0` on scroll

**"View All Projects" link:**  
Both mobile and desktop layouts include a `Link to="/projects"` at the end, styled as an underlined text link with `ArrowUpRight` icon, wrapped in `Magnetic` for cursor attraction. Navigates to the `/projects` page.

**Adding a new project:**
1. Add image to `src/assets/`
2. Import at top of `ProjectsSection.tsx` **and** `src/pages/Projects.tsx`
3. Add entry to the `projects` array in both files: `{ title: "...", domains: ["...", "..."], image: importedImg }`

---

### 11.4 PhilosophySection

**File:** `src/components/sections/PhilosophySection.tsx`  
**ID:** `#philosophy`  
**Background:** `hsl(var(--section-dark))`  
**Padding:** `py-24 md:py-32`

**Layout:** `flex flex-col md:flex-row`
- Left half (`md:w-1/2`): sticky heading (`md:sticky md:top-0 md:h-screen flex items-center`)
- Right half (`md:w-1/2`): scrolling principle cards

**Heading:** "I don't chase innovation. / I eliminate friction."
- Line 1: `foreground`
- Line 2: `muted-foreground`

**Principle cards data:**
```
01 — Applied AI
02 — SaaS Architecture
03 — Rapid Deployment
04 — User-Centric Design
```

**Card anatomy:**
- Animated border line (top): `h-px`, `scaleX: 0 → 1`
- Counter: `text-xs tracking-widest uppercase`, `muted-foreground`
- Title: `text-2xl md:text-4xl font-bold`, Space Grotesk, `foreground`
- Description: `text-base md:text-lg leading-relaxed`, Inter, `muted-foreground`, `max-w-md`

**Card animation sequence (staggered timeline per card):**
1. Border line draws in: `scaleX 0→1`, 0.8s, `power2.inOut`
2. Number fades in: `y: 12→0, opacity`, 0.6s, `power2.out`, offset +0.2
3. Title fades up: `y: 24→0, opacity`, 0.8s, `power3.out`, offset +0.3
4. Description fades up: `y: 20→0, opacity`, 0.8s, `power3.out`, offset +0.45

---

### 11.5 SkillsSection

**File:** `src/components/sections/SkillsSection.tsx`  
**ID:** `#skills`  
**Background:** INVERTED — `hsl(var(--inv-bg))`  
**Transition into:** Morphing SVG wave curves from `section-dark` → `inv-bg`

**Wave transition:**
Three overlapping SVG paths with animate from dramatic curves to flat lines via scrub:
- Wave 1: `fill: inv-wave-1`, scrub trigger `top 100% → top 20%`
- Wave 2: `fill: inv-wave-2`, scrub trigger `top 95% → top 15%`
- Wave 3: `fill: inv-wave-3`, scrub trigger `top 90% → top 10%`
- Wave container height: `clamp(160px, 25vw, 400px)`

**Skill groups:**
```
Core Languages & Platforms: Python, C, Java, SQL, Firebase, Supabase, Vercel
AI & Intelligence:           Applied AI, AI Automations, Context Engineering, AI Designing
AI-Augmented:                JavaScript, React, Next.js, Tauri
```

**Skill pill variants:**
| Class | Background | Text | Hover fill |
|---|---|---|---|
| `skill-card-outline` | transparent | `inv-fg` | `inv-card-bg` |
| `skill-card-filled` | `inv-card-bg` | `inv-card-fg` | `inv-border` |

AI skills use `skill-card-filled`. Core and Augmented use `skill-card-outline`.

**Pill anatomy:** `px-6 py-3 rounded-full`, relative, inner scale overlay for hover fill animation.

**Hover CSS classes:**
```css
.skill-card-outline:hover .skill-label { color: hsl(var(--inv-card-fg)); }
.skill-card-filled:hover .skill-label  { color: hsl(var(--inv-fg)); }
```

**Card entrance animation:** All `.skill-card` items, `y: 60 → 0, opacity: 0 → 1`, stagger 0.04s, `power3.out`, `ScrollTrigger` at `top 80%`.

**Section header:**
- Label: `text-xs tracking-[0.3em] uppercase`, Inter, `inv-muted`
- Heading: `text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight`, `inv-fg`

**Bottom statement:** `text-2xl md:text-3xl font-medium leading-relaxed`, Space Grotesk, `inv-muted`, `max-w-2xl`

---

### 11.6 FooterSection

**File:** `src/components/sections/FooterSection.tsx`  
**ID:** `#footer`  
**Layout:** Two phases — SVG morph transition, then dark content container

**SVG morph transition:**
- Transitions from `inv-bg` (white in dark mode) back to `section-dark`
- Two overlapping curved paths, `fill: section-dark`
- Both morph from dramatic curves to near-flat via scrub (`top bottom → top 35-40%`)
- Height: `clamp(120px, 20vw, 300px)`

**Content container:**
- `background: section-dark`, `color: foreground`
- `border-radius: 48px 48px 0 0` — the only element with a large explicit radius
- `margin-top: -48px` to overlap SVG transition

**Content:**
- Heading "Ready to build / the future?" — `text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold`, Space Grotesk
- Email link — `text-base sm:text-xl md:text-3xl lg:text-4xl font-medium`, `border-b-2`, wrapped in `Magnetic strength={30}`
- `ArrowUpRight` icon — animates `rotate-45` on link hover
- Bottom bar — "`Built with only AI — and intention.`", `text-lg md:text-xl tracking-wide`, Space Grotesk, centred, top border

**Animations:**
- Heading: `y: 60 → 0, opacity`, 1.2s, `power3.out`
- Email: `y: 40 → 0, opacity`, 1s delay 0.2, `power3.out`

---

## 12. Animation System

### 12.1 GSAP Setup

GSAP and ScrollTrigger are globally registered in **each component file** that uses them:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

All GSAP code is wrapped in `gsap.context(() => { ... }, sectionRef)` and cleaned up with `ctx.revert()` in the useEffect return.

### 12.2 Standard Entry Pattern

```ts
gsap.fromTo(
  element,
  { y: 40, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  }
);
```

**Guidance:**
- `toggleActions: "play none none reverse"` — plays forward on enter, reverses on scroll back. Use for elegant bidirectional reveals.
- `toggleActions: "play none none none"` — plays once and stays. Use for elements that should not re-animate.
- Never use `once: true` with ScrollTrigger for entrance animations; prefer `toggleActions`.

### 12.3 Scrub Animation Pattern

```ts
gsap.fromTo(
  path,
  { attr: { d: "... curved path ..." } },
  {
    attr: { d: "... flat path ..." },
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top 90%",
      end: "top 10%",
      scrub: 0.8,
    },
  }
);
```

- `scrub: 0.5–1.2` — smoothing lag in seconds. Higher values feel more cinematic.
- `scrub: 0` / `scrub: true` — instant tie to scroll position (no smoothing).

### 12.4 Easing Vocabulary

| Ease | Used for |
|---|---|
| `power3.out` | Standard element entry (heading, text, cards) |
| `power4.out` | Fast, snappy hero clip-path reveal |
| `power4.inOut` | Hero tagline wipe |
| `power2.out` | Subtle details (card numbers, border lines) |
| `power2.inOut` | Morphing paths, scale transitions |
| `power1.inOut` | Scrub animations (wave morphs) |
| `power2.in` | Exit / reverse animations |
| `back.out(1.4)` | Slot machine reel landing |
| `back.out(1.8)` | `%` symbol appearance in loader |
| `back.out(2)` | Theme icon swap |
| `elastic.out(1, 0.4)` | Slot machine lever snap-back |
| `elastic.out(1, 0.3)` | Magnetic cursor attraction |
| `none` | Reel initial spin (constant speed), scrub with no ease |

### 12.5 Stagger Values

| Context | Stagger |
|---|---|
| Manifesto lines (per block) | `0.15s` |
| Skill cards | `0.04s` |
| Nav heading chars | `0.04s` (enter), `0.02s` (leave) |
| Mobile project cards | `0.1s` delay multiplier |

### 12.6 Scroll Trigger Start Points

| Trigger start | When to use |
|---|---|
| `"top 85%"` | Large headings that should appear early |
| `"top 80%"` | Standard content elements |
| `"top 78%"` | Manifesto block — text needs slightly earlier reveal |
| `"top center"` | Navigation active section tracking |
| `"top bottom"` | Footer SVG morph — starts as soon as element enters viewport |
| scrub `"top 100%"` | Wave morph start — begins before section reaches viewport |

### 12.7 Animation Timing Reference

| Event | Time (s) |
|---|---|
| Loader frame enters | 0.3 |
| Lever appears | 0.5 |
| Lever pulls down | 1.2 |
| Reels start spinning | 1.55 |
| Reels land on 100 | ~3.1 |
| Frame fills black | ~3.6 |
| Hero content animations start (`delay: 3.6`) | 3.6 |

---

## 13. Theme System

### 13.1 How it Works

The theme is controlled by adding/removing the class `theme-light` on `document.documentElement`.

- Default (no class) = **dark mode**.
- With `.theme-light` = **light mode**.

The CSS file defines both `:root` (dark) and `.theme-light` (light) token sets. Tailwind reads from CSS variables so all Tailwind utility classes automatically adapt.

### 13.2 ThemeToggle Implementation

- `localStorage` key: `"theme"`, values: `"light"` / `"dark"`
- Initialised from `localStorage` on mount
- Changes class on `document.documentElement`

### 13.3 Adding or Editing a Theme Value

1. Locate the token in `src/index.css` under `:root` (dark).
2. Update it there.
3. Decide how it should look in light mode.
4. Update or add the same token under `.theme-light`.
5. Never leave a token defined in only one theme unless it's intentional (like `--radius`).

### 13.4 Inverted Section in Both Themes

The Skills section always contrasts with the surrounding sections:
- In dark mode: Skills = white, rest = near-black.
- In light mode: Skills = near-black, rest = near-white.

This is entirely governed by the `--inv-*` token set. Never hardcode `white` or `black` in skills/footer section — always use `hsl(var(--inv-bg))`, `hsl(var(--inv-fg))`, etc.

---

## 14. Adding New Content

### 14.1 Adding a New Project

1. Add the project image (PNG, ~800×600px, `aspect-ratio: 4/3`) to `src/assets/`.
2. Import it in `ProjectsSection.tsx`.
3. Add to the `projects` array:
   ```ts
   { title: "Project Name", domains: ["Domain A", "Domain B"], image: importedImg }
   ```
4. Desktop: the new card becomes part of the horizontal scroll automatically. Width stays `w-[40vw]`.
5. Mobile: appended to the vertical stack automatically.
6. Verify wrapper height calculation still works (it is dynamic based on `track.scrollWidth`).

### 14.2 Adding a New Skill

1. Find the appropriate group array in `SkillsSection.tsx` (`coreSkills`, `aiSkills`, or `augmentedSkills`).
2. Add the skill name as a string.
3. Card style is determined by the group — no per-item styling needed.

To add a **new skill group**:
1. Create a new array: `const newGroupSkills = ["Skill A", "Skill B"]`
2. Copy a group `<div>` block and update the heading and data source.
3. Use `skill-card-outline` or `skill-card-filled` class based on the group's intent.

### 14.3 Adding a New Philosophy Principle

1. Add object to the `principles` array in `PhilosophySection.tsx`:
   ```ts
   { title: "New Principle", description: "Description text here." }
   ```
2. The numbered counter (`0${i + 1}`) auto-increments.
3. All animations work off index — no manual wiring required.

### 14.4 Adding a New Section

Follow these steps precisely:

1. Create the component in `src/components/sections/NewSection.tsx`.
2. Give the root element a unique `id` (e.g., `id="new-section"`).
3. Use `hsl(var(--section-dark))` as background unless it's an intentional inverted section.
4. Add it to `Index.tsx` in the desired order inside `<main>`.
5. Add the section to `Navigation.tsx` — add entry to `navItems` and `fullLabels`:
   ```ts
   navItems: [..., { id: "new-section", label: "N" }]
   fullLabels: [..., "New Section"]
   ```
6. Add to `DynamicIsland.tsx` sections array:
   ```ts
   { id: "new-section", label: "07 / New Section" }
   ```
7. Update this document's section reference.

### 14.5 Adding a Manifesto Block

Add to the `blocks` array in `ManifestoSection.tsx`:
```ts
{
  lines: [
    "First line of text.",
    "Second line with keyword",
    "wrapped naturally.",
  ]
}
```
Add any new words that should be highlighted to the `highlightWords` Set. The SVG path dimension may need extending if the section grows significantly — update the `viewBox` height and path coordinates.

---

## 15. Asset Guidelines

### 15.1 Project Images

| Property | Value |
|---|---|
| Format | PNG (preferred) or WebP |
| Recommended size | 1200×900px |
| Aspect ratio | **4:3** (this is enforced in both mobile and desktop layouts) |
| Location | `src/assets/` |
| Naming | `[projectname].png` (lowercase) |

### 15.2 Fonts

Fonts are loaded via Google Fonts in `index.html`. The variable font for `TextPressure` (Compressa VF) is loaded from a Cloudinary CDN URL inside the component itself.

Do not install fonts locally — they are CDN-loaded for performance.

### 15.3 Icons

Use `lucide-react` exclusively. Currently used icons:
- `ArrowUpRight` — footer email link
- `Sun`, `Moon` — theme toggle

---

## 16. Do / Don't Cheat-sheet

| ✅ DO | ❌ DON'T |
|---|---|
| Use `hsl(var(--token))` for all colours | Use `#hex`, `rgb()`, or raw colour values |
| Use `Space Grotesk` for headings | Mix in a third font |
| Use `Inter` for body text | Change body font-family |
| Use `rounded-full` for pills/badges | Use `rounded-full` on card containers |
| Keep `--radius: 0rem` | Change `--radius` to add global rounding |
| Use GSAP for entrance animations | Use CSS `@keyframes` or `transition` for entrance |
| Use `hsl(var(--inv-*))` in skills/footer sections | Use `white` or `black` literals |
| Update both `:root` and `.theme-light` when editing tokens | Edit only one theme |
| Keep `lerp: 0.07` in Lenis | Increase lerp for "snappier" scroll |
| Keep `delay: 3.6` on hero animations | Lower hero animation delay without shortening the loader |
| Maintain `aspect-[4/3]` on project images | Use a different aspect ratio per project |
| Add new sections to Navigation AND DynamicIsland | Only update one of the two |
| Use `gsap.context()` and `ctx.revert()` in all useEffects | Call GSAP directly in useEffect without context |
| Test both dark and light themes after changes | Assume dark mode changes look fine in light mode |
| Use `will-change: transform` on animated elements | Apply `will-change` to every element indiscriminately |

---

*Last updated: March 2026*  
*Maintained by: Sakthivel*
## 13. Global Behaviors

### 13.1 Session-based Intro Loader

The `IntroLoader` is designed to be a one-time experience per browser tab session.
- **State management:** `Index.tsx` uses `sessionStorage.getItem("intro_seen")` to determine if the loader should be shown.
- **Scroll locking:** While the intro is active (`introComplete === false`), the `document.body.style.overflow` is set to `hidden` to prevent accidental scrolling through the content before the entrance animation.

### 13.2 Navigation Scroll Reset & Anchors

To ensure a proper transition between pages:
- **Projects to Top:** The `/projects` page resets the scroll position to `(0, 0)` on mount in `Projects.tsx`. Robust reset ensures it doesn't inherit scroll from the source page.
- **Back to Section End:** The "Back" link on the projects page targets `/#selected-works-bottom`. `Index.tsx` handles scrolling to this anchor after the intro animation is complete, then uses `window.history.replaceState` to clean the URL back to `/`.

---
