# Design System - Sakthivel Portfolio

This document reflects the current production implementation.

## 1. Product Surface

- App type: single-page portfolio with a dedicated projects route
- Primary routes:
- `/` -> cinematic portfolio narrative
- `/projects` -> expanded project gallery
- Motion strategy: GSAP + ScrollTrigger across major sections

## 2. Stack and Foundation

- React 18 + TypeScript
- Vite 5
- Tailwind CSS with CSS variable tokens
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- React Router DOM
- Radix primitives (toast, tooltip)
- Sonner notifications

## 3. Theme and Token System

Theme switching is handled by toggling `.theme-light` on `<html>`.

### Core tokens (dark default)

Defined in `src/index.css` under `:root`:

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--border`, `--input`, `--ring`

### Portfolio-specific tokens

- `--hero-bg`, `--hero-fg`
- `--manifesto-muted`, `--manifesto-active`
- `--section-dark`, `--section-light`
- `--pill-border`

### Inverted section tokens (Skills/Footer transition)

- `--inv-bg`, `--inv-fg`
- `--inv-muted`, `--inv-border`
- `--inv-card-bg`, `--inv-card-fg`
- `--inv-wave-1`, `--inv-wave-2`, `--inv-wave-3`

### Navigation tone tokens (reserved)

- `--nav-bg`, `--nav-border`
- `--nav-active-bg`, `--nav-active-fg`
- `--nav-muted`

## 4. Typography

- Body/UI: Inter
- Display/Headings: Space Grotesk
- Base behavior:
- `html` uses Inter
- `h1-h6` use Space Grotesk

## 5. Layout and Spacing

- Full-width section architecture; no fixed centered shell dependency
- Common section paddings:
- Standard: `py-24 md:py-32`
- Manifesto: `py-40 md:py-56`
- Horizontal spacing patterns:
- `px-6` to `px-8` mobile
- `md:px-16`
- `lg:px-24` on wider blocks

## 6. Section Architecture

Home route order (`src/pages/Index.tsx`):

1. IntroLoader overlay
2. ThemeToggle (fixed)
3. HeroSection
4. ManifestoSection
5. ProjectsSection
6. PhilosophySection
7. SkillsSection
8. FooterSection

Projects route (`src/pages/Projects.tsx`):

- Dedicated page with card reveal animations
- Back link to home anchor section

## 7. Animation System

### Global

- Lenis drives smooth scroll
- ScrollTrigger synced via `lenis.on("scroll", ScrollTrigger.update)`
- Cleanup is done with GSAP context reverts

### IntroLoader

- Slot machine style numeric reels
- Lever pull and rebound
- Morph to `%` symbol
- Black fill + scale transition out
- Images are preloaded before full timeline execution

### HeroSection

- Staggered reveal for title, columns, image slot, and meta bar
- Scroll-linked fade/translate exit treatment

### ManifestoSection

- SVG path draw animation
- Per-line reveal with symbol scrambling
- Highlight background bars scale in under selected words

### ProjectsSection

- Mobile mode:
- Vertical card reveal with clip-path masks
- Desktop mode:
- Horizontal pinned scroller
- Card reveal based on viewport presence
- Subtle parallax image offset during progress

### PhilosophySection

- Sticky left heading
- Right-side principle cards with staged timeline:
- line draw -> number -> title -> description

### SkillsSection

- Triple SVG wave morph from curved profiles to near-flat bands
- Skill chips reveal with staggered entrance
- Inverted theme section for visual contrast

### FooterSection

- Dual SVG top morph transition
- Heading + email reveal on scroll
- Magnetic CTA interaction

## 8. Interaction Patterns

- Magnetic hover effect for selected CTA links
- Theme toggle with icon transition and persisted localStorage state
- Hover-driven emphasis on skill chips
- Responsive project browsing pattern split by breakpoint

## 9. Responsive Strategy

- Mobile-first with Tailwind breakpoints (`md`, `lg`)
- Projects section switches behavior by `useIsMobile()` hook
- Hero and headings rely on `clamp()` for fluid scaling

## 10. Component Inventory (Current)

Actively used custom components:

- `SmoothScroll`
- `IntroLoader`
- `Magnetic`
- `ThemeToggle`
- Sections under `src/components/sections/*`

Actively used UI primitives:

- `ui/toast.tsx`
- `ui/toaster.tsx`
- `ui/tooltip.tsx`
- `ui/sonner.tsx`

## 11. Design Rules

- Keep palette achromatic unless a full token redesign is intentional
- Add new colors via variables, not hardcoded ad-hoc values
- Prefer GSAP for major entrance/scroll choreography
- Keep section timing and spacing coherent across routes
- Preserve cleanup patterns for all animation hooks

## 12. Maintenance Checklist

Before shipping visual or motion changes:

1. `npm run lint`
2. `npm run test`
3. `npm run build`
4. Verify both routes:
- `/`
- `/projects`
5. Verify theme toggle and key animation sequences on desktop and mobile widths
