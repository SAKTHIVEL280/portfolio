# Sakthivel Portfolio

A cinematic, AI-native portfolio built with React, TypeScript, GSAP, and Tailwind CSS.

## Overview

This project is a performance-focused single-page experience with a dedicated projects route.

- Intro slot-machine loader with image preloading
- Scroll-driven storytelling and section reveals
- Smooth scrolling via Lenis + GSAP ticker sync
- Fully responsive project showcase (horizontal desktop / vertical mobile)
- Theme toggle (dark/light) with persisted preference

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis (@studio-freight/lenis)
- React Router DOM
- TanStack React Query
- Radix UI (toast + tooltip primitives)
- Sonner (notifications)

## Visual Effects and Motion

- Intro sequence: slot reels, lever pull, morph-to-black transition
- Hero reveal: staged text and media clip-path animations
- Manifesto section: SVG path drawing, word scrambling, highlight-reveal animation
- Projects section:
- Mobile card stagger + mask reveals
- Desktop horizontal scroll track with parallax image offset
- Skills and Footer: SVG wave/path morphing tied to scroll progress
- Micro-interactions: magnetic hover effect, icon transitions, cursor states

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Open the local URL shown by Vite (default: http://localhost:8080).

## Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest tests once
- `npm run test:watch` - Run Vitest in watch mode

## Project Structure

- `src/pages/Index.tsx` - Main single-page experience
- `src/pages/Projects.tsx` - Full projects route
- `src/components/sections/` - Core content sections
- `src/components/SmoothScroll.tsx` - Lenis + ScrollTrigger integration
- `src/components/IntroLoader.tsx` - Intro loader animation
- `src/index.css` - Global tokens and styling system

## Production Notes

- Production bundle is generated with Vite tree-shaking and minification.
- Image assets are served as WebP for efficient payload size.
- Animation work is scoped and reverted with GSAP context cleanup.

## Deployment

Deploy the `dist/` output produced by:

```bash
npm run build
```

Primary production domain:

- `https://sakthivel.daeq.in`

This project is configured for Vercel hosting via `vercel.json`, including:

- SPA rewrites for React Router routes like `/projects`
- cache headers for versioned asset files
- basic hardening headers for browser security

It can also be deployed on Netlify, Cloudflare Pages, or any static hosting platform with equivalent SPA rewrite rules.
