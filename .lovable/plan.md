

# AI-Native Engineer Portfolio — Build Plan

## Overview
A hyper-premium, brutalist-minimalist portfolio for **Sakthivel**, an "AI-Native Engineer." Full grayscale aesthetic, GSAP-powered animations throughout, smooth Lenis scrolling, and interactive physics elements. Built with React + Vite + Tailwind + GSAP + Three.js.

## Approach
We'll build this in a **visual-first MVP** style — nail the layout, typography, color system, and core animations first across all sections, then layer in advanced effects (WebGL shaders, Matter.js physics, page transitions) in follow-up rounds.

**Font strategy:** Free alternatives — **Space Grotesk** (headings, bold brutalist feel) + **Geist/Inter** (body). Custom fonts can be swapped in later.

**GSAP strategy:** Free core GSAP + ScrollTrigger. DrawSVG simulated with `stroke-dasharray/dashoffset`. Text splitting done with custom code (no premium SplitText plugin).

**Project images:** Placeholder abstract visuals for now — easy to swap later.

---

## Section 1 — Hero (Split Cinematic Entry)
- Full-screen dark split layout (text left, SVG right)
- "hello.! I'm" intro line in lowercase
- **SAKTHIVEL** rendered large with a `TextPressure` component — variable font weight/width reacts to mouse proximity per character
- Infinite vertical text-swap loop alternating "AI - Native Engineer" / "I build professional products using AI" with elastic easing
- Right side: SVG hand blueprint with animated stroke draw-on effect + subtle wave rotation
- Staggered GSAP entrance timeline for all elements

## Section 2 — The Manifesto (Cryptographic Pin Reveal)
- Massive sticky-scroll section (~200vh)
- Text pinned at center, initially rendered in muted dark gray
- As user scrolls, each line activates with a "decoder" scramble effect — random symbols flash briefly, then snap to the real English text in bright white
- Scrub-linked to scroll position via GSAP ScrollTrigger
- Section unpins after final line resolves

## Section 3 — Projects (Horizontal Scroll Gallery)
- Pinned horizontal scrolling container with 4 large project cards
- **Redactify** (AI Security · Privacy), **VoiceSOP** (Applied AI · Automation), **MyLuQ** (Systems Engineering · Rust), **daeq.in** (Design · User Experience)
- Project title + domain tags visible below each image
- Custom "VIEW" cursor circle appears on card hover
- Placeholder images with grayscale treatment
- Smooth GSAP-powered horizontal scroll translation

## Section 4 — Philosophy (Pinned Reveal Mask)
- Two-column layout (~300vh): sticky left heading + scrolling right content
- Left: "I don't chase innovation. I eliminate friction."
- Right: 4 principle blocks (Applied AI, SaaS Architecture, Rapid Deployment, User-Centric Design)
- Each block reveals with a clip-path wipe-up animation triggered on scroll

## Section 5 — The Inversion Curve + Skills Playground
- Visual transition from dark to light theme via animated curved border that flattens on scroll
- Skills rendered as interactive physics pills using Matter.js
- Two visual categories: Core Capabilities (light pills, dark border) and AI-Augmented Stack (dark pills, light text)
- Mouse-draggable pills with realistic bounce and weight
- DOM elements mapped to physics body positions for crisp typography

## Section 6 — Footer & Outro
- Continues bright/light theme
- "Ready to build the future?" large text
- Oversized email link with magnetic hover effect
- Bottom bar: "Sakthivel © 2026" left, "Built with only AI — and intention." right

## Section 7 — Global Polish
- **Dynamic Island:** Fixed bottom pill showing current section context (e.g., "01 / Hero"). Updates as user scrolls between sections
- **Magnetic hover:** Reusable `<Magnetic>` wrapper component using `gsap.quickTo` — applied to nav items, footer email, Dynamic Island
- **Lenis smooth scroll:** Global smooth scrolling with customized lerp
- **GSAP CustomEase:** All animations use custom cubic curves, no default/linear eases
- Dark/light color system defined in CSS variables for the theme inversion

## Tech Stack & Libraries to Install
- `gsap` (core + ScrollTrigger + CustomEase)
- `@studio-freight/lenis` (smooth scroll)
- `matter-js` (physics pills)
- `@react-three/fiber@^8.18` + `three` + `@react-three/drei@^9.122.0` (WebGL for future shader effects)
- Google Fonts: Space Grotesk + Inter

