@AGENTS.md

# SubTurbo Web Prototype

High-fidelity iOS app prototype for SubTurbo, an AI subtitle generator.

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (no external UI libraries)
- Zustand for state management
- Framer Motion for animations

## Design
- Dark-first iOS design system
- Mobile-first (393x852pt iPhone 15 Pro)
- Desktop shows phone frame mockup
- PWA-ready (manifest.json)

## Screens
/ — Home/Import
/onboarding — 3-page swipeable onboarding
/processing — Simulated processing with timers
/editor — Unified editor with Style/Text tabs, video preview, fullscreen mode
/editor/subtitles — (redirect to /editor)
/preview — (redirect to /editor)
/export — Rendering progress + success state
/paywall — Subscription paywall
/settings — App settings

## State
- Zustand store at src/store/useAppStore.ts
- localStorage for onboarding flag and free video tracking
- Style settings persist in Zustand during session
