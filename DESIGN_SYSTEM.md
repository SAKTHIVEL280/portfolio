# Design System

## Philosophy

Brutalist minimalist grayscale aesthetic using the full spectrum from `#000000` to `#FFFFFF`. No noise, grain, or visual textures. Every element exists with purpose ~ nothing decorative, everything functional.

---

## Color Tokens

All colors are defined as HSL values in `src/index.css` and consumed via Tailwind's semantic classes. **Never use hardcoded color values in components.**

### Core Palette (Dark ~ Default)

| Token | HSL | Usage |
|---|---|---|
| `--background` | `0 0% 4%` | Page background |
| `--foreground` | `0 0% 95%` | Primary text |
| `--card` | `0 0% 7%` | Card surfaces |
| `--card-foreground` | `0 0% 95%` | Card text |
| `--primary` | `0 0% 95%` | CTA, emphasis |
| `--primary-foreground` | `0 0% 4%` | Text on primary |
| `--secondary` | `0 0% 12%` | Subtle surfaces |
| `--muted` | `0 0% 15%` | Disabled / subdued areas |
| `--muted-foreground` | `0 0% 55%` | Secondary text, labels |
| `--accent` | `0 0% 18%` | Interactive hover states |
| `--border` | `0 0% 18%` | Borders, dividers |
| `--ring` | `0 0% 55%` | Focus rings |

### Portfolio-Specific Tokens

| Token | HSL | Usage |
|---|---|---|
| `--hero-bg` | `0 0% 4%` | Hero section background |
| `--hero-fg` | `0 0% 93%` | Hero section text |
| `--manifesto-muted` | `0 0% 25%` | Manifesto inactive text |
| `--manifesto-active` | `0 0% 96%` | Manifesto highlighted text |
| `--section-dark` | `0 0% 4%` | Dark section backgrounds |
| `--section-light` | `0 0% 95%` | Light / inverted sections |
| `--pill-border` | `0 0% 20%` | Navigation pill borders |

### Light Theme Override (`.theme-light`)

Applied to inverted sections (e.g. Skills, Footer). Swaps foreground/background values for high-contrast light surfaces.

---

## Typography

### Font Stack

| Alias | Font | Usage |
|---|---|---|
| `font-heading` | Space Grotesk | Headings (h1–h6), display text |
| `font-body` | Inter | Body copy, labels, UI text |

Both loaded via Google Fonts. Applied globally in `index.css`:
- `html` → Inter
- `h1–h6` → Space Grotesk

### Conventions

- Use tildes (`~`) instead of em dashes (`—`) to separate clauses
- Headings are uppercase or sentence case depending on context
- Body text stays `text-muted-foreground` for hierarchy

---

## Spacing & Layout

- `--radius: 0rem` ~ sharp corners everywhere, no border-radius
- Container max-width: `1400px` centered with `2rem` padding
- Generous negative space between sections
- Full-viewport hero sections (`min-h-screen`)

---

## Motion

All motion is powered by **GSAP** with **Lenis** smooth scrolling.

### Principles

- Every entrance, exit, and state change must feel deliberate and fluid
- Animations replay on every viewport entry (`toggleActions: "play none none reverse"`)
- No CSS transitions for scroll-driven effects ~ GSAP only

### Scroll

- **Lenis** hijacks native scroll for buttery-smooth inertia
- `ScrollTrigger` pins and scrubs horizontal scroll (Projects section)
- Staggered fade-ins on vertical content

### Entrance Patterns

| Pattern | Properties | Easing |
|---|---|---|
| Fade up | `y: 60 → 0, opacity: 0 → 1` | `power3.out` |
| Stagger | `stagger: 0.15` on children | `power3.out` |
| Scale in | `scale: 0.95 → 1` | `power2.out` |
| Text reveal | `opacity` per word, scrub-linked | Linear scrub |

### Interactive

- **Magnetic effect** on buttons/links ~ element follows cursor within radius
- **Custom cursor** (`view-cursor`) on project cards ~ 100px circle, inverted colors
- **TextPressure** component for variable-weight text on hover

---

## Component Architecture

### Design System Classes

```tsx
// ✅ Correct ~ use semantic tokens
<div className="bg-background text-foreground border-border">

// ❌ Wrong ~ hardcoded colors
<div className="bg-black text-white border-gray-800">
```

### Key Components

| Component | Purpose |
|---|---|
| `IntroLoader` | Full-screen animated entry sequence |
| `TextPressure` | Variable font-weight on mouse proximity |
| `Magnetic` | Wrapper adding magnetic cursor-follow effect |
| `FallingText` | Matter.js physics-driven text blocks |
| `SmoothScroll` | Lenis provider for scroll hijacking |
| `DynamicIsland` | Floating pill navigation (currently disabled) |

### Section Structure

```
Index.tsx
├── IntroLoader (overlay, fades out)
├── SmoothScroll (Lenis wrapper)
│   ├── HeroSection
│   ├── ManifestoSection
│   ├── PhilosophySection
│   ├── SkillsSection (theme-light)
│   ├── ProjectsSection
│   └── FooterSection (theme-light)
```

---

## Responsive Strategy

- **Desktop**: Horizontal scroll for projects, full-bleed layouts
- **Mobile** (`useIsMobile`): Vertical card stack, reduced font sizes, tighter padding
- Breakpoints follow Tailwind defaults (`sm`, `md`, `lg`, `xl`)
- Touch devices get simplified scroll interactions (no horizontal scrub)

---

## Files Reference

| File | Role |
|---|---|
| `src/index.css` | CSS variables, global styles, Lenis config |
| `tailwind.config.ts` | Token mapping, animations, container config |
| `src/lib/utils.ts` | `cn()` utility for class merging |
| `src/components/ui/` | shadcn/ui primitives |
